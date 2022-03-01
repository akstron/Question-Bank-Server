module.exports.handleError = (e, res) => { 
    console.log(e);
    if(!e.error){
        return res.status(500).json({
            status: false,
            error: 'Something went wrong'
        });
    }

    return res.status(400).json({
        status: false,
        error: e.error
    });
}