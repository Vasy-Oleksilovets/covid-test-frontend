const isEmpty = (param) => {
    if(param) return false;
    else return true;
}

const isEmail = (param) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(param).toLowerCase());
}

const isPhone = (param) => {
    const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneno.test(String(param).toLowerCase());
}

function isZipCode(elementValue){
    var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
    return zipCodePattern.test(elementValue);
}


module.exports = {isEmpty, isPhone, isEmail, isZipCode}