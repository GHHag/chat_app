const aclRules = require('./acl-rules.json');

module.exports = function (tableName, req) {
    let userRole = req.session.user ? req.session.user.userRole : 'visitor';
    let method = req.method.toLowerCase();
    method = method === 'patch' ? 'put' : method;
    console.log(aclRules[userRole]);
    console.log(aclRules[userRole][tableName]);
    console.log(aclRules[userRole][tableName][method]);
    let allowed = aclRules?.[userRole]?.[tableName]?.[method];
    return !!allowed;
}