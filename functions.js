
const Functions = {
    test: (data, params) => {

        return `siteId ${params.siteId}`
    },
    testpost: (data, params) => {
        console.log("TESTPOST CALLED");
        console.log(params)
        return `route ${params.employeeId}`
    },
}


module.exports = Functions;
