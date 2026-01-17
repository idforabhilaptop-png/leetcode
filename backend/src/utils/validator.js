import validator from "validator"

const validate = (data) => {
    const mandatoryField = ["firstName", "emailId", "password"]
    const IsAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));
    if (!IsAllowed)
        throw new Error("Fields Missing");

    if (!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    if (!validator.isStrongPassword(data.password))
        throw new Error("Week Password");

    if (!(data.firstName.length >= 3 && data.firstName.length <= 20))
        throw new Error("Name should have atleast 3 char and atmost 20 char");
}
export default validate