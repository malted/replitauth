module.exports = function() { 
    this.accessMessage = function(res) {
        return res.status(403).send({
            success: false,
            message: "This subdomain is for internal use only.",
        });
    };
}
