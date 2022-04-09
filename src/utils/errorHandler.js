class ClientError extends Error {
    constructor(message){
        super(message);
        this.status = false;
        this.isClientError = true;
    }
}

module.exports.ClientError = ClientError;

module.exports.handleError = (e, res) => { 
    console.log(e);

    if(e.isClientError){
        return res.status(400).json({
            status: e.status,
            error: e.message
        });
    }

    return res.status(500).json({
        status: false,
        error: 'Internal server error'
    });
}