import PageManager from './page-manager';

export default class Page extends PageManager {}

const backgroundImgPath = $('.static-page--bg').text().trim();
const staticSubHeading = $('.static-page--subheading').text();

// grab static image from bigcommerce editor and make it into a background image 
$('.static__image').css('background-image', `url(${backgroundImgPath}`);

// grab static subheading and put it inside div 
$('.static__subheading').html(staticSubHeading);

if ($(window).width() < 801) {
    $('.static-page--inner').append($("h1"));
    $('.static-page--inner').append($('.static__subheading'));

    $('.mobile-dropdown').on('click',function(){
        $('.side-navBarSection').toggleClass('active');
    });
}

// toggle side menu

const childrenListItems = $('.side-navBar--children-alt');
const plus = $('.icon--add');
const minus = $('.icon--remove');

$(plus).on('click', function() {
    $(this).parent().addClass('active');
});

$(minus).on('click', function() {
    $(this).parent().removeClass('active');
});

// toggle faqs page

  // show first set when window loads
  // apply handler to each title
  $('.faq__item__question__title').on('click', function() {
      // apply styling class to THIS title
      $(this).toggleClass('faq-active');
      // show THIS title's content
      $(this).next().slideToggle().toggleClass('faq-active');
  });

