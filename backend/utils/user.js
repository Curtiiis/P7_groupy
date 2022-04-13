User.create = (newUser, result) => {
    db.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
        result(err, null);
        return;
    }
    result(null, { 
        id: res.id, 
        newUser 
        })
    });
};