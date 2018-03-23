var schema = new Schema({
   userEmail: {
        type: String,
        validate: validators.isEmail()
    },
     name: {
        type: String
    },
    number: {
        type: Number
    },
    comments: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Contact', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

contactUs: function (data, callback) {
        async.waterfall([
                function (cbWaterfall) {
                    Contact.saveData(data, function (err, complete) {
                        if (err) {
                            cbWaterfall(err, null);
                        } else {
                            if (_.isEmpty(complete)) {
                                cbWaterfall(null, []);
                            } else {
                                console.log("complete", complete);
                                cbWaterfall(null, complete);
                            }
                        }
                    });
                },
                function (complete, cbWaterfall1) {
                    var emailData = {};
                    console.log("data: ", data);
                    emailData.email = "sayali.ghule@wohlig.com";
                    emailData.name = data.name;
                    emailData.number = data.number;
                    emailData.comments = data.comments;
                    emailData.from = data.userEmail;
                    emailData.filename = "contactUs.ejs";
                    emailData.subject = "Contact Us";
                     emailData._id =complete._id;
                    console.log("emaildata", emailData);

                    Config.email(emailData, function (err, emailRespo) {
                        if (err) {
                            console.log(err);
                            cbWaterfall1(null, err);
                        } else if (emailRespo) {
                            cbWaterfall1(null, emailRespo);
                        } else {
                            cbWaterfall1(null, "Invalid data");
                        }
                    });
                },
            ],
            function (err, data2) {
                if (err) {
                    console.log(err);
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, []);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },
    
};
module.exports = _.assign(module.exports, exports, model);