const { convertCommaSeparatedToArrays } = require("./advanceFilter")

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        console.log("Filtering with query parameters:", this.queryString); // Debug log the query parameters

        const queryObj = { ...this.queryString }; 
        console.log("Constructed query object for filtering:", queryObj); // Debug log the constructed query object

        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        const convertedQuery = convertCommaSeparatedToArrays(queryObj);
        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(convertedQuery);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|nin|in|ne)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr)); 
        console.log("Final query after filtering:", this.query); // Debug log the final query

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
