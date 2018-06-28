import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';

export default function (context) {
    // console.log('IntuitSolutions.net - Quick Order');

    // exit script if context isn't passed
    if (!context) {
        console.error('Must pass context to Quick Order script');
        return;
    }


    /*
    ##
    ## JAVASCRIPT OBJECTS FOR ALL ELEMENTS ESSENTIAL TO QUICK ORDER
    ##
    ## - any section tagged with "CUSTOMIZABLE" can be easily edited and
    ##   may require different values depending on how the store's html is laid out
    ##
    ## - the elements below already have default event handlers attached to them
    ##   which are just barebones. any functions tagged with "place custom logic here" can be customized.
    ##   in most cases, defaultbehavior() should be left alone as they contain
    ##   essential code for the quick order to run properly.
    ##
    */

    // containers for each product on the product list
    var items = {
        /* CUSTOMIZABLE */
        selector: '.quickOrder__item', // the selector to use to find the items with jquery
        errorClass: 'quickOrder__item--hasError', // the classname to use when adding the item produces errors
        hasQtyClass: 'quickOrder__item--hasQty', // the classname to use when the item has quantity and is addable to the cart
        addedClass: 'quickOrder__item--added', // the classname to use when the item has been added to the cart
        disabledClass: 'quickOrder__item--disabled', // the classname to use when the item can't be added to the cart
        errorClass: 'quickOrder__item--error', // the classname to use when the item has an error

        hasOptionsClass: 'quickOrder__item--hasOptions', // items with this attribute will have their product options ajaxed
        idAttribute: 'item-id', // attribute that contains the id of the item's product
        urlAttribute: 'item-url', // attribute that contains the url of the item's product
        optionsContainer: '.quickOrder__options', // selector used to find the container that will hold the product options html after being ajaxed
        optionsTemplate: 'products/product-options', // name of the template to use when pulling in the product options
        /* CUSTOMIZABLE */

        elements: null,
        optionsElements: null,

        init: function() {
            this.elements = $(this.selector);
            this.optionsElements = $(this.optionsContainer, this.elements);


            /*
            add product options to any items that has it
            */

            if (context.quickOrder_withOptions)
                Promise.all(

                    this.elements
                    .filter(`.${items.hasOptionsClass}`)
                    .toArray()
                    .map((el, index, array) => {

                        // get data from the item's attributes
                        const item = {
                            id: el.getAttribute(items.idAttribute),
                            url: el.getAttribute(items.urlAttribute),
                            element: $(el)
                        };

                        const itemPromise = new Promise((resolve, reject) => {

                            utils.api.getPage(item.url, { template: items.optionsTemplate }, (err, content) => {

                                // unable to get product options
                                if (err)
                                    return reject(err);

                                new Promise(ongetoptionsResolve => items.ongetoptions(item, ongetoptionsResolve))

                                // default behavior of items.ongetoptions
                                .then(function() {

                                    content = item.element.find(items.optionsElements).append(content);

                                    /*
                                    fix options with duplicate ids by
                                    finding each radio button with its matching label and making their ids unique
                                    */
                                    var labels = $('[data-product-attribute-value]', content);
                                    content.find('[type=radio]').each((i, el) => {
                                        el.id += '-' + item.id;
                                        labels.filter(`[data-product-attribute-value=${el.value}]`).attr('for', el.id);
                                    });

                                    resolve();
                                });
                            });
                        })

                        // getting item options was unsuccessful
                        .catch(function(err) {
                            console.error(err);

                            item.element
                                .addClass(items.errorClass)
                                .find(addItem.elements)
                                    .text(context.addItem_unavailable);
                        });

                        return itemPromise;
                    })
                )

                // after all product with options have been ajaxed
                .then(function() {

                    items.elements
                        .not(`.${items.errorClass}`)
                        .removeClass(items.disabledClass)

                        .find(addItem.elements)
                        .text(context.addItem_defaultText);

                    // automatically selects Auto-Ship & Save for Auto-Ship Page
                    if ($('.dailies').length > 0) {
                        $('.js-subscribeSave').click();
                        // removes the One-Time Purchase from the Auto-Ship Page
                        $('.js-autoship option[data-product-attribute-value="183"]').hide();
                        $('.js-autoship option[data-product-attribute-value="184"]').prop('selected', true);
                    }

                });
        },

        getaddable: function() {
            return this.elements
                .filter(`.${this.hasQtyClass}`)
                .not(`.${this.disabledClass}`)
                .not(`.${this.errorClass}`);
        },

        // what happens after the item's options are rendered
        ongetoptions: function(item, defaultbehavior) {
            // place custom logic here
            item.element.find(items.optionsElements).addClass('quickOrder__options--show');
            
            defaultbehavior();
        },

        // what happens when an item updates quantity
        update: function(textInput, qty) {
            // update text input
            textInput
            .val(qty)
            .attr('value', qty);

            items.elements.has(textInput)
            .toggleClass(items.hasQtyClass, (qty > 0)) // update state of item
            
            // if product was already added, reset it
            .removeClass(items.addedClass)
            .find(addItem.elements)
            .text(addItem.defaultText);
        },
    };
    items.init();


    // form container for each product
    var itemForms = {
        /* CUSTOMIZABLE */
        selector: '.quickOrder__form',
        /* CUSTOMIZABLE */

        elements: null,

        init: function() {
            this.elements = $(this.selector, items.elements);
        },

        // what happens when the form gets updated
        onchange: function(defaultbehavior, nextbehavior) {
            // place custom logic here

            // if defaultbehavior is disabled, nextbehavior must be called
            defaultbehavior();
        },

        // what happens after receiving api response containing new product data
        ongetdata: function(err, response, defaultbehavior) {
            // place custom logic here

            defaultbehavior(response);
        }
    };
    itemForms.init();


    // product price element
    var itemPrice = {
        /* CUSTOMIZABLE */
        selector: '.quickOrder__price',
        /* CUSTOMIZABLE */

        elements: null,

        init: function() {
            this.elements = $(this.selector, items.elements);
        },
    };
    itemPrice.init();


    // product alert message element
    var itemMessage = {
        /* CUSTOMIZABLE */
        selector: '.quickOrder__message',
        /* CUSTOMIZABLE */

        elements: null,

        init: function() {
            this.elements = $(this.selector, items.elements);
        },
    };
    itemMessage.init();


    // quantity increment buttons
    var itemInc = {
        /* CUSTOMIZABLE */
        selector: '.quickOrder__incBtn',
        /* CUSTOMIZABLE */

        elements: null,

        init: function() {
            this.elements = $(this.selector, items.elements);
        },

        // what happens when the increment buttons are clicked
        onclick: function(event, defaultbehavior) {
            // place custom logic here

            defaultbehavior();
        },
    };
    itemInc.init();


    // quantity number text inputs
    var itemInput = {
        /* CUSTOMIZABLE */
        selector: '.quickOrder__qty',
        /* CUSTOMIZABLE */

        elements: null,

        init: function() {
            this.elements = $(this.selector, items.elements);
        },

        // what happens when text input is changed
        onchange: function(event, defaultbehavior) {
            // place custom logic here

            defaultbehavior();
        },
    };
    itemInput.init();


    // add item button
    var addItem = {
        /* CUSTOMIZABLE */
        selector: '.quickOrder__add',
        defaultText: context.addItem_defaultText,
        addingText: context.addItem_addingText,
        addedText: context.addItem_addedText,
        /* CUSTOMIZABLE */

        elements: null,

        init: function() {
            this.elements = $(this.selector, items.elements);
        },

        // what happens when the button is clicked
        onclick: function(event, defaultbehavior) {
            // place custom logic here

            defaultbehavior();
        },

        // what happens before the items will be added to cart
        beforeadding: function(defaultbehavior) {
            // place custom logic here

            defaultbehavior();
        },

        // what happens when the item is added to cart
        // - item: the current scope of the item that's being added
        alladded: function(item) {
            // place custom logic here
        },

        // what happens when there's an error adding one of the items
        // - errorItem: the current scope of the item that's giving you an error
        onerror: function(errorItem) {
            // place custom logic here
        },
    };
    addItem.init();


    // add all buttons
    var addall = {
        /* CUSTOMIZABLE */
        selector: '.quickOrder__addAll',
        defaultText: context.addall_defaultText,
        addingText: context.addall_addingText,
        /* CUSTOMIZABLE */

        elements: null,

        init: function() {
            this.elements = $(this.selector);
        },

        // this must return true for the addall.success to run
        validation: function() {
            return items.getaddable().not(`.${items.addedClass}`).length > 0;
        },

        // what happens if add all passes validation
        success: function(defaultbehavior) {
            // place custom logic here

            defaultbehavior();
        },

        // what happens if add all fails validation
        fail: function(defaultbehavior) {
            // place custom logic here

            defaultbehavior();
        },

        beforeadding: function(defaultbehavior) {
            // place custom logic here

            defaultbehavior();
        },

        // what happens when all items have been successfully added
        alladded: function(defaultbehavior) {
            // place custom logic here

            defaultbehavior();

            // will redirect user to cart page after your logic finishes
            gotocart(); // delete this line to not do that
        },

        // what happens when there's an error adding one of the items
        // - errorItem: the current scope of the item that's giving you an error
        onerror: function(errorItem, defaultbehavior) {
            // place custom logic here

            defaultbehavior();
        },
    };
    addall.init();


    var loading = $('.quickOrder-loading');






    /*
    ##
    ## BELOW ARE EVENT HANDLERS FOR ALL ELEMENTS ABOVE
    ## - the code below handles all the essential logic for the quick order. proceed with caution
    ##
    */


    /*
    ## wire up the quantity inputs
    */
    itemInc.elements.click(function(event) {
        const thisQtyBtn = this;

        new Promise(resolve => itemInc.onclick.call(thisQtyBtn, event, resolve))
        // default behavior of itemInc.onclick
        .then(function() {

            const $target = $(thisQtyBtn);
            const $input = items.elements.has($target).find(itemInput.elements);
            let qty = parseInt($input.val(), 10);

            if (isNaN(qty))
                qty = 0;

            // If action is incrementing
            if ($target.data('action') === 'inc') {
                qty++;
            } else if (qty > 0) {
                qty--;
            }

            items.update($input, qty);
        });
    });


    /*
    ## wire up manually entering a quantity
    */
    itemInput.elements.change(function(event) {
        event.preventDefault();

        const thisQtyInput = this;

        new Promise(resolve => itemInput.onchange.call(thisQtyInput, event, resolve))
        // default behavior of itemInput.onchange
        .then(function() {

            let qty = parseInt(thisQtyInput.value, 10);

            // validate quantity
            if (
                isNaN(qty) ||
                qty < 0
            ) qty = 0;

            items.update($(thisQtyInput), qty);
        });
    });


    /*
    ## wire up updating forms with options
    */
    itemForms.elements.change(function() {
        const thisForm = this;
        const scope = items.elements.has(this);

        new Promise(ongetdataresolve => {
            new Promise(onchangeresolve => {
                
                itemForms.onchange.call(thisForm, onchangeresolve, ongetdataresolve);

            // default behavior of itemForms.onchange
            }).then(function() {

                if (!scope.hasClass(items.hasOptionsClass)) return;

                // prepare sending data
                utils.api.productAttributes.optionChange(
                    scope.attr(items.idAttribute),
                    itemForms.elements.filter(thisForm).serialize(),

                    // after receiving new data
                    function(err, response) {

                        // assemble arguments to use in itemForms.ongetdata
                        const newArguments = Array.prototype.slice.call(arguments);
                        newArguments.push(ongetdataresolve);

                        itemForms.ongetdata.apply(thisForm, newArguments);
                    }
                );
            });

        // default behavior of itemForms.ongetdata
        }).then(function(response) {
            response = response.data;

            scope
            // disable or enable product
            .toggleClass(items.disabledClass, !response.instock || !response.purchasable)

            // update the price of this product
            .find(itemPrice.elements)
            .text(response.price.without_tax.formatted)

            // show alert message
            .end()
            .find(itemMessage.elements)
            .text(response.purchasing_message);
        });
    });


    /*
    ## wire up adding a single product to cart
    */
    addItem.elements.click(function(event) {
        // do nothing if item is disabled
        if (items.elements.has(event.currentTarget).hasClass(items.disabledClass))
            return;

        const thisAddBtn = this;

        new Promise(resolve => addItem.onclick.call(thisAddBtn, event, resolve))
        // default behavior of addItem.onclick
        .then(function() {

            const thisItem = items.elements.has(thisAddBtn); // get our item's scope
            var thisQtyInput = thisItem.find(itemInput.elements); // this product's text input

            // change state before adding
            thisItem.addClass(items.hasQtyClass);

            addItems(thisItem.find(itemForms.elements).toArray(),

                // what happens before items will be added
                function(next) {

                    new Promise(resolve => addItem.beforeadding(resolve))
                    // default behavior of addItem.beforeadding
                    .then(() => {

                        // if quantity is at 0, update to 1
                        if (thisQtyInput.val() === '0')
                            thisQtyInput
                            .val('1')
                            .attr('value', '1')
                            .change();

                        next();
                    });
                },

                addItem.onerror, // what happens when there's error while adding items
                addItem.alladded, // what happens after items are added
            );
        });
    });


    /*
    ## wire up clicking add all button
    */
    addall.elements.click(function() {

        if (addall.validation()) {

            new Promise(resolve => addall.success.call(this, resolve))
            // default behavior of addall.success
            .then(function() {

                addItems(items.getaddable().find(itemForms.elements).toArray(),

                    // what happens before items will be added
                    function(next) {

                        new Promise(resolve => addall.beforeadding(resolve))
                        // default behavior of addall.beforeadding
                        .then(() => {
                            addall.elements.text(addall.addingText);
                            next();
                        });
                    },

                    // what happens when there's error while adding items
                    // - errorItem: the offending item
                    function(errorItem) {

                        new Promise(resolve => addall.onerror(errorItem, resolve))
                        // default behavior of addall.onerror
                        .then(() => {
                            addall.elements.text(addall.defaultText);

                            // scroll user to the error product
                            $('html, body').animate({
                                scrollTop: (errorItem.offset().top - 30)
                            }, 700);
                        });
                    },

                    // what happens after items are added
                    function() {

                        new Promise(resolve => addall.alladded(resolve))
                        // default behavior of addall.alladded
                        .then(() => {
                            addall.elements.text(addall.defaultText);
                        });
                    }
                );
            });

        } else {
            new Promise(resolve => addall.fail.call(this, resolve))
            // default behavior of addall.fail
            .then(function() {
                alert("Please make sure you filled in a quantity for the products you'd like.");
            });
        }
    });


    // function to AJAX add each form
    function addItems(productForms, beforeCallback, errorCallback, finishCallback) {
        loading.show();

        // default productForms to array
        if (!Array.isArray(productForms))
            productForms = [productForms];

        new Promise(resolve => {
            if (typeof beforeCallback == 'function')
                beforeCallback(resolve);

            else resolve();

        }).then(() => {

            // run all items one by one until array is exhausted
            const runQueueInOrder = (endpoint) => {

                var currentItem = items.elements.has(endpoint); // current item's scope
                var currentButton = currentItem.find(addItem.elements);

                currentItem.removeClass(items.errorClass);
                currentButton.text(addItem.addingText);

                utils.api.cart.itemAdd(new FormData(endpoint), (err, response) => {

                    // take note of errors
                    const errorMessage = err || response.data.error;
                    // Guard statement
                    if (errorMessage) {
                        loading.hide();

                        if (typeof errorCallback == 'function')
                            errorCallback(currentItem); // pass the offending item to the callback

                        currentButton.text(addItem.defaultText);
                        currentItem.addClass(items.errorClass); // highlight item with the error

                        // alert user of error
                        return alert(errorMessage);

                    } else {
                        currentButton.text(addItem.addedText);

                        currentItem
                        .removeClass(items.errorClass)
                        .addClass(items.addedClass);
                    }

                    // run next item
                    if (productForms.length)
                        runQueueInOrder(productForms.shift());

                    // when done all products
                    else {
                        loading.hide();

                        if (typeof finishCallback == 'function')
                            finishCallback(currentItem);
                    }
                });
            };

            runQueueInOrder(productForms.shift());
        });
    }


    // redirect to cart function
    function gotocart() {
        window.location.href = context.urls.cart;
    }
}
