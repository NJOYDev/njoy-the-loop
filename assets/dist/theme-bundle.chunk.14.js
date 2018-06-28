webpackJsonp([14],{

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_manager__ = __webpack_require__(241);
function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var Page=function(_PageManager){_inherits(Page,_PageManager);function Page(){_classCallCheck(this,Page);return _possibleConstructorReturn(this,_PageManager.apply(this,arguments))}return Page}(__WEBPACK_IMPORTED_MODULE_0__page_manager__["a" /* default */]);/* harmony default export */ __webpack_exports__["default"] = (Page);var backgroundImgPath=$('.static-page--bg').text().trim();var staticSubHeading=$('.static-page--subheading').text();// grab static image from bigcommerce editor and make it into a background image 
$('.static__image').css('background-image','url('+backgroundImgPath);// grab static subheading and put it inside div 
$('.static__subheading').html(staticSubHeading);if($(window).width()<801){$('.static-page--inner').append($('h1'));$('.static-page--inner').append($('.static__subheading'));$('.mobile-dropdown').on('click',function(){$('.side-navBarSection').toggleClass('active')})}// toggle side menu
var childrenListItems=$('.side-navBar--children-alt');var plus=$('.icon--add');var minus=$('.icon--remove');$(plus).on('click',function(){$(this).parent().addClass('active')});$(minus).on('click',function(){$(this).parent().removeClass('active')});// toggle faqs page
// show first set when window loads
// apply handler to each title
$('.faq__item__question__title').on('click',function(){// apply styling class to THIS title
$(this).toggleClass('faq-active');// show THIS title's content
$(this).next().slideToggle().toggleClass('faq-active')});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)))

/***/ })

});
//# sourceMappingURL=theme-bundle.chunk.14.js.map