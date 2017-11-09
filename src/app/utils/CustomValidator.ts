
export class CustomerValidator {
  static EmailValidator(email: string): boolean {
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return true;
    }
    return false;
  }

  // Password must be at 6-15 digits long with no symbols and should include at least one numeric digit
  static PasswordValidator(password: string): boolean {
    if (/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/.test(password)) {
      return true;
    }
    return false;
  }

  // Check that it is only numbers
  static PhoneNumberValidator(phoneNumber: string): boolean {
    if (/^[0-9]+$/.test(phoneNumber)) {
      return true;
    }
    return false;
  }
}
