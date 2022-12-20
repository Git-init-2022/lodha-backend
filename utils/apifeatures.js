class UserApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.FlatNo ? {
            FlatNo: {
                $regex: this.queryStr.FlatNo,
                $options: "i"
            }
        } : {};

        console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }

}


module.exports = {UserApiFeatures}