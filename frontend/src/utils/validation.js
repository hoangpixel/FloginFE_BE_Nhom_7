// unit test cho phần username
const regexUsername = /^[a-zA-Z0-9_.-]+$/;
const regexPassword1 = /\d/;
const regexPassword2 = /[a-zA-Z]/;
export const validateUsername = (username) => {
    if(!username)
    {
        return 'username khong duoc de trong';
    }
    if(username.length < 3)
    {
        return 'username phai co it nhat 3 ky tu tro len';
    }
    if(username.length > 50)
    {
        return 'username khong duoc vuot qua 50 ky tu';
    }

    if(!regexUsername.test(username))
    {
        return 'username khong duoc chua cac ky tu dac biet';
    }
    return '';
}

// unit test cho phần password  
export const validatePassword = (password) => {
    if(!password)
    {
        return 'password khong duoc de trong';
    }
    if(password.length < 6)
    {
        return 'password phai co it nhat 6 ky tu tro len';
    }
    if(password.length > 100)
    {
        return 'password khong duoc vuot qua 100 ky tu';
    }
    if(!regexPassword1.test(password) || !regexPassword2.test(password))
    {
        return 'password phai co ca chu lan so';
    }
    return '';
}