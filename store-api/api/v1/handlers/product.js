const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {

  const products = await Product.find()
  // .sort('price')
<<<<<<< HEAD
  // .select('name price rating');
=======
  .select('-rating');
>>>>>>> f46f282 (Initial commit)

  console.log(req.query)

  res.status(200).json({success: true, data: { products, nbHits: products.length }});

};


<<<<<<< HEAD
=======
// sample on how to paginate data 
>>>>>>> f46f282 (Initial commit)
const getAllProducts = async (req, res) => {

  const { featured, company, name, sort, fields, numericFilters } = req.query;
  
  const queryObject = {};

<<<<<<< HEAD
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
=======
//   if (featured) {
//     queryObject.featured = featured === 'true' ? true : false;
//   }

//   if (company) {
//     queryObject.company = company;
//   }

//   if (name) {
//     queryObject.name = { $regex: name, $options: 'i' };
//   }

//   if (numericFilters) {
//     const operatorMap = {
//       '>': '$gt',
//       '>=': '$gte',
//       '=': '$eq',
//       '<': '$lt',
//       '<=': '$lte',
//     };

//     const regEx = /\b(<|>|>=|=|<|<=)\b/g;

//     let filters = numericFilters.replace(
//       regEx,
//       (match) => `-${operatorMap[match]}-`
//     );
    
//     const options = ['price', 'rating'];
//     filters = filters.split(',').forEach((item) => {
//       const [field, operator, value] = item.split('-');
//       if (options.includes(field)) {
//         queryObject[field] = { [operator]: Number(value) };
//       }
//     });
//   }

  let result = Product.find(queryObject);

//   // sort
//   if (sort) {
//     const sortList = sort.split(',').join(' ');
//     result = result.sort(sortList);
//   } else {
//     result = result.sort('createdAt');
//   }

//   if (fields) {
//     const fieldsList = fields.split(',').join(' ');
//     result = result.select(fieldsList);
//   }

//   const page = Number(req.query.page) || 1;
  const page = Number(req.params.pageNumber) || 1;
  console.log(req.params.pageNumber)
  const limit = Number(req.query.limit) || 18;
>>>>>>> f46f282 (Initial commit)
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  // 23
  // 4 7 7 7 2

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });

};


module.exports = {
  getAllProducts,
  getAllProductsStatic,
};