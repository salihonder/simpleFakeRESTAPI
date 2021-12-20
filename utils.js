function queryData(data, query, lookfor) {
    const splitArr = query.split('/')
    const select = splitArr[0]
    const where = splitArr[1].replace(/[{}]/g,'')

    console.log(`where ${where}, select ${select}`)
    if(where === '*') {
        return data[select];
    } else {
        return data[select].filter(o => o[where] == lookfor)
    }
}

function updateData(data, query, lookfor, newData) {
    const splitArr = query.split('/')
    const select = splitArr[0]
    const where = splitArr[1].replace(/[{}]/g,'')

    console.log(`where ${where}, select ${select}`)

    const itemIndex = data[select].findIndex(o => o[where] == lookfor)
    data[select][itemIndex] = newData;
    console.log("itemIndex = " + itemIndex)
}

function deleteData(data, query, lookfor) {
    const splitArr = query.split('/')
    const select = splitArr[0]
    const where = splitArr[1].replace(/[{}]/g,'')

    console.log(`where ${where}, select ${select}`)

    const itemIndex = data[select].findIndex(o => o[where] == lookfor)
    if(itemIndex > -1) {
        data[select].splice(itemIndex,1);
        return true;
    }
    
    return false;
  
}

function findEndpoint(route, name, version) {
    return route.replace(`/${name}/${version}/`,"").split("/")[0] || ""
}

function isBodyDataMatch(postBody, mapBody) {
    if(postBody instanceof Object && mapBody instanceof Object) {
        const mapKeys = Object.keys(mapBody)
        return Object.keys(postBody).every(key => mapKeys.includes(key));
    } 
    
    return false;
}

// keep it later to get parameters
const grab = (flag) => {
    const index = process.argv.indexOf(flag);
    return (index === -1) ? null : process.argv[index+1];
}


exports.queryData = queryData;
exports.findEndpoint = findEndpoint;
exports.isBodyDataMatch = isBodyDataMatch;
exports.updateData = updateData;
exports.deleteData = deleteData;