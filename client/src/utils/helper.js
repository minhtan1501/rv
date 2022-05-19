export const isValidEmail = (email) =>{
    const regexEmail = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexEmail.test(email)
  }

  