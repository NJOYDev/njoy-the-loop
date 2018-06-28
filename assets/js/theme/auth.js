import PageManager from './page-manager';
import stateCountry from './common/state-country';
import $ from 'jquery';
import nod from './common/nod';
import validation from './common/form-validation';
import forms from './common/models/forms';
import { classifyForm, Validators } from './common/form-utils';

export default class Auth extends PageManager {
 constructor() {
  super();
  this.formCreateSelector = 'form[data-create-account-form]';
 }

 registerLoginValidation($loginForm) {
  const loginModel = forms;

  this.loginValidator = nod({
   submit: '.login-form input[type="submit"]'
  });

  this.loginValidator.add([
   {
    selector: '.login-form input[name="login_email"]',
    validate: (cb, val) => {
     const result = loginModel.email(val);

     cb(result);
    },
    errorMessage: this.context.useValidEmail
   },
   {
    selector: '.login-form input[name="login_pass"]',
    validate: (cb, val) => {
     const result = loginModel.password(val);

     cb(result);
    },
    errorMessage: this.context.enterPass
   }
  ]);

  $loginForm.submit(event => {
   this.loginValidator.performCheck();

   if (this.loginValidator.areAll('valid')) {
    return;
   }

   event.preventDefault();
  });
 }

 registerForgotPasswordValidation($forgotPasswordForm) {
  this.forgotPasswordValidator = nod({
   submit: '.forgot-password-form input[type="submit"]'
  });

  this.forgotPasswordValidator.add([
   {
    selector: '.forgot-password-form input[name="email"]',
    validate: (cb, val) => {
     const result = forms.email(val);

     cb(result);
    },
    errorMessage: this.context.useValidEmail
   }
  ]);

  $forgotPasswordForm.submit(event => {
   this.forgotPasswordValidator.performCheck();

   if (this.forgotPasswordValidator.areAll('valid')) {
    return;
   }

   event.preventDefault();
  });
 }

 registerNewPasswordValidation() {
  const newPasswordForm = '.new-password-form';
  const newPasswordValidator = nod({
   submit: $(`${newPasswordForm} input[type="submit"]`)
  });
  const passwordSelector = $(`${newPasswordForm} input[name="password"]`);
  const password2Selector = $(
   `${newPasswordForm} input[name="password_confirm"]`
  );

  Validators.setPasswordValidation(
   newPasswordValidator,
   passwordSelector,
   password2Selector,
   this.passwordRequirements
  );
 }

 registerCreateAccountValidator($createAccountForm) {
  const validationModel = validation($createAccountForm);
  const createAccountValidator = nod({
   submit: `${this.formCreateSelector} input[type='submit']`
  });
  const $stateElement = $('[data-field-type="State"]');
  const emailSelector = `${
   this.formCreateSelector
  } [data-field-type='EmailAddress']`;
  const $emailElement = $(emailSelector);
  const passwordSelector = `${
   this.formCreateSelector
  } [data-field-type='Password']`;
  const $passwordElement = $(passwordSelector);
  const password2Selector = `${
   this.formCreateSelector
  } [data-field-type='ConfirmPassword']`;
  const $password2Element = $(password2Selector);

  createAccountValidator.add(validationModel);

  if ($stateElement) {
   let $last;

   // Requests the states for a country with AJAX
   stateCountry($stateElement, this.context, (err, field) => {
    if (err) {
     throw new Error(err);
    }

    const $field = $(field);

    if (createAccountValidator.getStatus($stateElement) !== 'undefined') {
     createAccountValidator.remove($stateElement);
    }

    if ($last) {
     createAccountValidator.remove($last);
    }

    if ($field.is('select')) {
     $last = field;
     Validators.setStateCountryValidation(createAccountValidator, field);
    } else {
     Validators.cleanUpStateValidation(field);
    }
   });
  }

  if ($emailElement) {
   createAccountValidator.remove(emailSelector);
   Validators.setEmailValidation(createAccountValidator, emailSelector);
  }

  if ($passwordElement && $password2Element) {
   createAccountValidator.remove(passwordSelector);
   createAccountValidator.remove(password2Selector);
   Validators.setPasswordValidation(
    createAccountValidator,
    passwordSelector,
    password2Selector,
    this.passwordRequirements
   );
  }

  $createAccountForm.submit(event => {
   createAccountValidator.performCheck();

   if (createAccountValidator.areAll('valid')) {
    // populate Responsys From and send it
     $('.form--email-integration').submit();
    return;
   }

   event.preventDefault();
  });
 }

 /**
  * Request is made in this function to the remote endpoint and pulls back the states for country.
  * @param next
  */
 loaded(next) {
  const $createAccountForm = classifyForm(this.formCreateSelector);
  const $loginForm = classifyForm('.login-form');
  const $forgotPasswordForm = classifyForm('.forgot-password-form');
  const $newPasswordForm = classifyForm('.new-password-form'); // reset password

  //Test script for Responsys form
  $('.form--test').on('change', function() {
    //email
    $('input[name="EMAIL_ADDRESS_"]').val($('[data-label="Email Address"]').val());
    //first name
    $('input[name="FIRST_NAME"]').val($('[data-label="First Name"]').val());
    //last name
    $('input[name="LAST_NAME"]').val($('[data-label="Last Name"]').val());
    //company name
    $('input[name="COMPANY_NAME"]').val($('[data-label="Company Name"]').val());
    //phone number
    $('input[name="PHONE_NUMBER"]').val($('[data-label="Phone Number"]').val());
    //Billing Address line 1
    $('input[name="POSTAL_STREET_1_"]').val($('[data-label="Billing Address Line 1"]').val());
    //Billing Address line 2
    $('input[name="POSTAL_STREET_2_"]').val($('[data-label="Billing Address Line 2"]').val());
    //city
    $('input[name="CITY_"]').val($('[data-label="City"]').val());
    //Country
    $('input[name="COUNTRY_"]').val($('[data-label="Country"]').val());
    //State
    $('input[name="STATE_"]').val($('[data-label="State"]').val());
    //Zip code
    $('input[name="POSTAL_CODE_"]').val($('[data-label="Zip Code"]').val());
    //Date of Birth (month)
    $('input[name="FormFieldMonth"]').val($('[data-label="month"]').val());
    //Date of Birth (day)
    $('input[name="FormFieldDay"]').val($('[data-label="day"]').val());
    //Date of Birth (year)
    $('input[name="FormFieldYear"]').val($('[data-label="year"]').val());
  });
  //Date of Birth (month)
  $('#FormField_33_day').on('change', function () {
    const thisValue = $('#FormField_33_day').val();
    $('#month_value').val(thisValue);
  });
  //Date of Birth (day)
  $('#FormField_33_month').on('change', function () {
    const thisValue = $('#FormField_33_month').val();
    $('#day_value').val(thisValue);
  });
  //Date of Birth (year)
  $('#FormField_33_year').on('change', function () {
    const thisValue = $('#FormField_33_year').val();
    $('#year_value').val(thisValue);
  });

  // intuitsolutions validation start
  const phoneSelector =
   'form[data-create-account-form] [data-field-type="Phone"]';
  const $phoneElement = $(phoneSelector);
  const zipSelector = 'form[data-create-account-form] [data-field-type="Zip"]';
  const $zipElement = $(zipSelector);
  const fNameSelector =
   'form[data-create-account-form] [data-field-type="FirstName"]';
  const $fNameElement = $(fNameSelector);
  const lNameSelector =
   'form[data-create-account-form] [data-field-type="LastName"]';
  const $lNameElement = $(lNameSelector);
  const companySelector =
   'form[data-create-account-form] [data-field-type="CompanyName"]';
  const $companyElement = $(companySelector);

  $zipElement.attr('maxlength', '5');
  // phone field must contain 10 digits or more
  $phoneElement.attr({
   pattern: '[0-9]{10,}',
   title: 'Please enter 10 Digits or More'
  });

  // phone number field being changed
  $(phoneSelector + ',' + zipSelector).keypress(function(evt) {
   // prevent anything but numbers
   if (evt.which < 48 || evt.which > 57) {
    evt.preventDefault();
   }
  });

  // prevent anything but letters being typed in the first, last, and company name
  // fields
  $(fNameSelector + ',' + lNameSelector + ',' + companySelector).keypress(
   function(event) {
    if (
     (event.keyCode > 64 && event.keyCode < 91) ||
     (event.keyCode > 96 && event.keyCode < 123) ||
     event.keyCode == 8 ||
     event.keyCode == 32 ||
     event.keyCode == 16
    ) {
     return true;
    } else {
     event.preventDefault(); // prevent from being typed
     return false;
    }
   }
  );

  // prevent copy/paste the first, last, and company name fields
  $(fNameSelector + ',' + lNameSelector + ',' + companySelector).on(
   'copy paste',
   function(event) {
    event.preventDefault();
   }
  );
  // intuitsoltions validation end

  // Injected via auth.html
  this.passwordRequirements = this.context.passwordRequirements;

  if ($loginForm.length) {
   this.registerLoginValidation($loginForm);
  }

  if ($newPasswordForm.length) {
   this.registerNewPasswordValidation();
  }

  if ($forgotPasswordForm.length) {
   this.registerForgotPasswordValidation($forgotPasswordForm);
  }

  if ($createAccountForm.length) {
   this.registerCreateAccountValidator($createAccountForm);
  }

  next();
 }
}
