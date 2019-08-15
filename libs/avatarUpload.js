function avatarUpload(req) {
    return new Promise((resolve, reject) => {

        if (!req.files) reject();
        let myfile = req.files.file;
        
        const rootPath = process.cwd();

        // Use the mv() method to place the file somewhere on your server
        let timestamp = Date.now();
        let path = rootPath + '/public/images/' + timestamp + myfile.name;
        myfile.mv(path, function (err) {
            if (err)
                reject();
            resolve(timestamp + myfile.name);
        });
    })

}

module.exports = avatarUpload;