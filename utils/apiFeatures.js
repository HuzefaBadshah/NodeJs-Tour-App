class ApiFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    console.log('queryObj before: ', queryObj);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(item => {
      delete queryObj[item];
    });
    console.log('queryObj after: ', queryObj);
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    console.log('queryStr : ', queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(defaultSort = '') {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      console.log('sortBy: ', sortBy);
      this.query = this.query.sort(`${sortBy} _id`);
      //sort('price average something...')
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  limit(defaultLimit = '') {
    if (this.reqQuery.fields) {
      const selectedFields = this.reqQuery.fields.split(',').join(' ');
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select(defaultLimit);
    }
    return this;
  }

  pagination() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (this.query.page) {
    //   const numTours = await this.query.countDocuments();
    //   console.log('numTours: ', numTours);
    //   if (skip >= numTours) {
    //     throw new Error('This page does not exist');
    //   }
    // }
    return this;
  }
}

module.exports = ApiFeatures;
