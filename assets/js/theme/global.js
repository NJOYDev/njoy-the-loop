import $ from 'jquery';
import './common/select-option-plugin';
import 'html5-history-api';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import compareProducts from './global/compare-products';
import privacyCookieNotification from './global/cookieNotification';
import maintenanceMode from './global/maintenanceMode';
import carousel from './common/carousel';
import 'lazysizes';
import loadingProgressBar from './global/loading-progress-bar';
import sweetAlert from './global/sweet-alert';
import * as Cookies from 'js-cookie';
import swal from 'sweetalert2';

// expose jQuery to window object
window.$ = $;


export default class Global extends PageManager {
    /**
     * You can wrap the execution in this method with an asynchronous function map using the async library
     * if your global modules need async callback handling.
     * @param next
     */
    

    relocateMenuOnMobile() {
        const dropDownMenu = $('.js-move-menu');
        const topLevelMenuContainer = $('.js-target');
        const topLevelMenuItems = $('.js-has-children');

        if ($(window).width() < 800) {
            $(dropDownMenu).insertAfter(topLevelMenuContainer);
        } 

        $(window).resize(function() {
            if ($(window).width() < 800) {
                $(dropDownMenu).insertAfter(topLevelMenuContainer);
            } else {
                for (var i = 0; i < topLevelMenuItems.length; i++) {
                    // each js-move-menu needs to go into each js-has-children
                }
            }
        }); 
        // if else needs to be on page reload as well, not just on resize
    }
    
    setActiveClassOnMenuList() {
        // // go through each item and on hover, remove all classes and add active class on hover

        $('.navPage-subMenu-item').on('mouseover', function() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
        // hover off - reset
        $('.js-move-menu').on('mouseleave', function() {
            // loop over each dropdown menu
            $('.navPages-action--toplevel + .navPage-subMenu').each(function(index, el) {
                // grab current dropdown menu items
                const thisCatSubItems = $(el).find('.navPage-subMenu-item');
                // remove active from all of this dropdown's items
                thisCatSubItems.removeClass('active');
                // add active to the FIRST of this dropdowns items
                thisCatSubItems.eq(0).addClass('active');
            });
        });
    }

    
    addCurrentClassToTopLevelMenu() {
        $('.js-has-children').on({
            mouseenter: function() {
                $(this).addClass('current-toplevel');
            },
            mouseleave: function () {
                $(this).removeClass('current-toplevel');
            }
        });
    }

        
    
    setToggleFooter() {
        if ($(window).width() < 800) {
            $('.footer-info-list').hide();
            $('.footer-info-heading').on('click', function () {
                $(this).next().slideToggle(200);
                $(this).toggleClass('collapsed');
            });
        }
    }


    cartPreviewSlideOut() {
        const cartItem = $('.cart-action');

        (cartItem).on('click', function(){
            $(document.body).toggleClass('slide-out')
        });

       
    

    }
    
    loaded(next) {
        quickSearch();
        currencySelector();
        foundation($(document));
        quickView(this.context);
        cartPreview();
        compareProducts(this.context.urls);
        carousel();
        menu();
        mobileMenuToggle();
        privacyCookieNotification();
        maintenanceMode(this.context.maintenanceMode);
        loadingProgressBar();
        sweetAlert();


        /*
        ## gate gate modal stuff
        */
        // if wanna remove cookie for testing
        // Cookies.remove('passedAgeGate');


        const passedAgeGate = Cookies.get('passedAgeGate'); // grab the cookie if it exists
        // console.log("passedAgeGate ", passedAgeGate);
        // if user hasn't passed the age gate
        if (passedAgeGate !== 'true') {
            // show the age gate modal
            swal({
                title: 'I confirm that I am 21 years of age or over and I am of legal age to view and purchase content and products from the site',
                text: "This site is restricted to Tobacco consumers being 21 years of age and over only.",
                showCancelButton: true,
                confirmButtonText: 'I am over 21',
                confirmButtonClass: 'age-gate-button--over button--primary-light',
                cancelButtonText: 'I am Under 21',
                cancelButtonClass: 'age-gate-button--under button--primary-dark',
                allowOutsideClick: false,
                allowEscapeKey: false,
                reverseButtons: false,

                onOpen: () => {
                    const $cancelBtn = $('.swal2-cancel');
                    $cancelBtn.closest('.swal2-actions').prepend($cancelBtn);
                }
            }).then((result) => {
                // if clicked over 21
                if (result.value) {
                    Cookies.set('passedAgeGate', 'true');
                    swal.close();
                // if under 21
                } else if (result.dismiss === 'cancel') {
                  window.location = 'https://www.google.com/';
                }
            });
        }

        /*
        ## toggle search bar open on mobile when click search icon
        */
        $('#toggle-mobileSearch').on('click', (event) => {
            event.preventDefault(); // prevent default link click action
            $('.header__main-search').slideToggle('fast'); // toggle the search bar open
            $('#search_query').focus(); // try to put cursor inside the search input field
        });

        // refresh slider when open tab to fix visual problems
        $('.productTabs .tab-title').on('click', function() {
            // grab end of href aka the number (one, two or three)
            const thisTabNumber = $(this).attr('href').replace('#myTab-', '');

            // use setTimeout because the tab scripts neeed to show the slides before the carousel can accurately calculate the slide widths etc.
            setTimeout(() => {
                $(`#myTab-${thisTabNumber} .slick-slider`).slick('unslick').slick();
            }, 240);
        });

        const mobileSubMenu = $('.vape-life-menu .navPage-subMenu-item');
    
        $('.cart--close-btn').on('click', function () {
            // console.log('clicked')
            $(document.body).removeClass('slide-out');
        });

        this.setActiveClassOnMenuList();  
        this.relocateMenuOnMobile();
        this.cartPreviewSlideOut();
        this.setToggleFooter();
        this.addCurrentClassToTopLevelMenu();
        next();
    }
}
