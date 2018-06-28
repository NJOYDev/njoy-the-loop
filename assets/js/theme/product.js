/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from './page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/form-utils';

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    }

    before(next) {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#write_review') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        next();
    }

    loaded(next) {
        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes);

        videoGallery();

        const $reviewForm = classifyForm('.writeReview-form');
        const review = new Review($reviewForm);

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation(this.context);
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        const autoShip = $('.js-autoship-fake');
        const quantityBox = $('.form-field--increments');
        

        // append auto ship options under quantity box
        $(autoShip).insertAfter($(quantityBox));

        // make fake select box hook into real one
        const oneTimePurchaseSelect = $('.js-oneTimePurchase');
        const subscribeSaveSelect = $('.js-subscribeSave');
        const fakeSelects = $('.js-autoship-fake select option');
        const realSelects = $('.js-autoship select option');
        // const currentlySelectedFakeOption = $(fakeSelects).filter(':selected');
        const fakeDropDown = $('.js-autoship-fake select');
        

        $(fakeDropDown).on('change', function() {
            const currentlySelectedFakeOption = $(fakeSelects).filter(':selected');
            $(subscribeSaveSelect).prop('checked', 'checked');
            const fakeProductAttributeValue = $(currentlySelectedFakeOption).data('option-select');
            $('.js-autoship select option').prop('selected', false);
            $(`.js-autoship select option[value=${fakeProductAttributeValue}]`).prop('selected', true).change();
        });
              
        $(subscribeSaveSelect).on('click', function(){
            const currentlySelectedFakeOption = $(fakeSelects).filter(':selected');
            const fakeProductAttributeValue = $(currentlySelectedFakeOption).data('option-select');
            $('.js-autoship select option').prop('selected', false);
            $(`.js-autoship select option[value=${fakeProductAttributeValue}]`).prop('selected', true).change();
            
        });
        
        $(oneTimePurchaseSelect).on('click', function(){
            const fakeProductAttributeValue = $(this).data('one-time-purchase');
            $('.js-autoship select option').prop('selected', false);
            $(`.js-autoship select option[value=${fakeProductAttributeValue}]`).prop('selected', true).change();
        });
        
        // handlebars doesn't allow for banner text to be inside of anchor tag, so we append it here
        $('.product-banner-link').append($('.product--banner-cta'));
        
        next();
    }

    after(next) {
        this.productReviewHandler();

        next();
    }

    productReviewHandler() {
        if (this.url.indexOf('#write_review') !== -1) {
            this.$reviewLink.click();
        }
    }
}



// const autoShip = $('.js-autoship-fake');
// const quantityBox = $('.form-field--increments');


// // append auto ship options under quantity box
// $(autoShip).insertAfter($(quantityBox));

// // make fake select box hook into real one
// const oneTimePurchaseSelect = $('.js-oneTimePurchase');
// const subscribeSaveSelect = $('.js-subscribeSave');
// const fakeSelects = $('.js-autoship-fake select option');
// const realSelects = $('.js-autoship select option');
// const currentlySelectedFakeOption = $(fakeSelects).filter(':selected');
// const fakeDropDown = $('.js-autoship-fake select');

// $(fakeDropDown).on('change', function(){
//     $(subscribeSaveSelect).attr('checked', 'checked');
//     const fakeProductAttributeValue = $(currentlySelectedFakeOption).data('option-select');
   
//     $(realSelects).each(function(){
//         let realAttributeValue = $(this).data('product-attribute-value'); 

//         if (fakeProductAttributeValue === realAttributeValue ) {
//             $(this).attr('selected', true).change();
            
//         } else {
//             $(this).attr('selected', false);

//         }
//     });
// });

// $(subscribeSaveSelect).on('click', function(){
//     const fakeProductAttributeValue = $(currentlySelectedFakeOption).data('option-select');
   
    // $(realSelects).each(function(){
    //     let realAttributeValue = $(this).data('product-attribute-value'); 

    //     if (fakeProductAttributeValue === realAttributeValue ) {
    //         $(this).attr('selected', true).change();
    //     } else {
    //         $(this).attr('selected', false);
    //     }
    // });
// });

// $(oneTimePurchaseSelect).on('click', function(){
//     const fakeProductAttributeValue = $(this).data('one-time-purchase');
   
//     $(realSelects).each(function(){
//         let realAttributeValue = $(this).data('product-attribute-value'); 

//         if (fakeProductAttributeValue === realAttributeValue ) {
//             $(this).attr('selected', true).change();
//         } else {
//             $(this).attr('selected', false);
//         }
//     });
// });
