function fetchData(data, query, lookfor) {
    const splitArr = query.split('/')
    const select = splitArr[0]
    const where = splitArr[1].replace(/[{}]/g, '')

    if (where === '*') {
        return data[select]
    } else {
        return data[select].filter(o => o[where] == lookfor)
    }
}

function updateData(data, query, lookfor, newData) {
    const splitArr = query.split('/')
    const select = splitArr[0]
    const where = splitArr[1].replace(/[{}]/g, '')

    const itemIndex = data[select].findIndex(o => o[where] == lookfor)
    data[select][itemIndex] = newData
}

function deleteData(data, query, lookfor) {
    const splitArr = query.split('/')
    const select = splitArr[0]
    const where = splitArr[1].replace(/[{}]/g, '')

    const itemIndex = data[select].findIndex(o => o[where] == lookfor)
    if (itemIndex > -1) {
        data[select].splice(itemIndex, 1)
        return true
    }

    return false
}

function findEndpoint(route, name, version) {
    const replaceString = version ? `/${name}/${version}/` : `/${name}/`
    return route.replace(replaceString, '').split('/')[0] || ''
}

function isEndPointMatch(route, name, version, endpoint) {
    const replaceString = version ? `/${name}/${version}/` : `/${name}/`
    route.replace(replaceString, '').split('/')[0] || ''
    const pathArr = route.replace(replaceString, '').split('/')
    const endpointArr = endpoint.split('/')

    const isMatch = endpointArr.every((item, index) => {
        let isItemMatch = false

        if (/^{[A-Za-z0-9]*}$/.test(item)) {
            isItemMatch = pathArr[index] ? true : false
        } else {
            isItemMatch = pathArr[index] === item ? true : false
        }
        return isItemMatch
    })

    return isMatch
}

function isBodyDataMatch(postBody, mapBody) {
    if (postBody instanceof Object && mapBody instanceof Object) {
        const mapKeys = Object.keys(mapBody)
        return Object.keys(postBody).every(key => mapKeys.includes(key))
    }

    return false
}

const removeBrackets = item => item.replace(/[{}]/g, '')
const filter = (data, syntax, isArray) => {
    let results

    const filterParam = syntax.substring(
        syntax.indexOf('[') + 1,
        syntax.indexOf(']'),
    )

    if (filterParam == '') return data
    if (isArray) {
        results = data.map(o => {
            return filterParam
                .split(',')
                .reduce((obj, item) => ({ ...obj, [item]: o[item] }), {})
        })
    } else {
        results = Object.keys(data).reduce((o, k) => {
            const filteredObj = filterParam
                .split(',')
                .reduce((obj, item) => ({ ...obj, [item]: data[k][item] }), {})
            return { ...o, [k]: filteredObj }
        }, {})
    }

    return results
}
const convert = (data, syntax, isArray) => {
    const convertTo = syntax.split(':')[1]
    

    if (convertTo && convertTo.includes('Array')) {
        if (isArray) {
            return data
        } else {
            return Object.keys(data).map(k => data[k])
        }
    } else if (convertTo && convertTo.includes('Object')) {
        
        if (isArray) {
            return data.reduce((o, item, i) => {
                return { ...o, [i + 1]: item }
            }, {})
        } else {
            return data
        }
    }

    return data
}

function queryData(name, version, data, response, endpoint, route) {
    const replaceString = version ? `/${name}/${version}/` : `/${name}/`
    route.replace(replaceString, '').split('/')[0] || ''
    const pathArr = route.replace(replaceString, '').split('/')
    const endpointArr = endpoint.split('/')
    const params = {}
    const result = {}

    // Get parameters
    endpointArr.map((item, index) => {
        if (/^{[A-Za-z0-9]*}$/.test(item)) {
            params[removeBrackets(item)] = pathArr[index]
        }
    })


    const responseKeys = Object.keys(response)

    // Prepare query results for each response props
    Object.values(response).map((item, index) => {
        // {parameter}
        if (/^{[A-Za-z0-9]*}$/.test(item)) {
            result[removeBrackets(item)] = params[removeBrackets(item)]
            // constant value or query
        } else {
            const splitArr = item.substring(0, item.indexOf('}') + 1).split('/')
            const select = splitArr[0]
            const whereType = splitArr[1]
                ? removeBrackets(splitArr[1])
                : 'constant'

               

            if (whereType === '*') {
                result[responseKeys[index]] = data[select]

                const isArray = Array.isArray(data[select])

                if (isArray) {
                    const qresult = data[select];
                    const filterResults = filter(qresult, item, isArray)
                   
                    const convertResults = convert(filterResults, item, isArray)

                    result[responseKeys[index]] = convertResults
                } else {
                    const resArr = Object.keys(data[select]).filter(oID => {
                        return data[select][oID]
                    });

                    const qresult = resArr.reduce(
                        (obj, item) => ({ ...obj, [item]: data[select][item] }),
                        {},
                    )

                    const filterResults = filter(qresult, item, isArray)
                   
                    const convertResults = convert(filterResults, item, isArray)

                    result[responseKeys[index]] = convertResults
                }
            } else if (whereType === 'constant') {
                result[responseKeys[index]] = item
                // filter with given params
            } else {
                const conditionKeys = whereType.split(',')
                const isArray = Array.isArray(data[select])

                if (isArray) {
                    const qresult = data[select].filter(o => {
                        return conditionKeys.every(
                            conditionKey =>
                                o[conditionKey] == params[conditionKey],
                        )
                    })
                    const filterResults = filter(qresult, item, isArray)
                    
                    const convertResults = convert(filterResults, item, isArray)

                    result[responseKeys[index]] = convertResults
                } else {
                    const resArr = Object.keys(data[select]).filter(oID => {
                        return conditionKeys.every(
                            conditionKey =>
                                data[select][oID][conditionKey] ==
                                params[conditionKey],
                        )
                    })

                    const qresult = resArr.reduce(
                        (obj, item) => ({ ...obj, [item]: data[select][item] }),
                        {},
                    )

                    const filterResults = filter(qresult, item, isArray)
                  
                    const convertResults = convert(filterResults, item, isArray)

                    result[responseKeys[index]] = convertResults
                }
            }
        }
    })

    return result
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

exports.fetchData = fetchData
exports.queryData = queryData
exports.findEndpoint = findEndpoint
exports.isEndPointMatch = isEndPointMatch
exports.isBodyDataMatch = isBodyDataMatch
exports.updateData = updateData
exports.deleteData = deleteData
exports.removeBrackets = removeBrackets
exports.syntaxHighlight = syntaxHighlight
