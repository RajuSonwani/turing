const knex = require("./pool")
const express = require("express");
const router = express.Router();

// departments
router.get("/departments",require("./routes/department").department);
router.get("/departments/:id",require("./routes/department").departmentById);

//categories
router.get("/categories",require("./routes/category").category);
router.get("/categories/:id",require("./routes/category").categoryById);
router.get("/categories/indepartment/:department_id",require("./routes/category").categoryByDepartmentId);
router.get("/categories/inproduct/:product_id",require("./routes/category").categoryByProductId);

//attributes
router.get("/attributes",require("./routes/attribute").attribute);
router.get("/attributes/:id",require("./routes/attribute").attributeById);
router.get("/attributes/values/:attribute_id",require("./routes/attribute").attributeByValueAttributeId);
router.get("/attributes/inproduct/:product_id",require("./routes/attribute").attributeByProductProductId);

//products
router.get("/products",require("./routes/product").product);
router.get("/products/search",require("./routes/product").productBySearch);
router.get("/products/:id",require("./routes/product").productById);
router.get("/products/incategory/:category_id",require("./routes/product").productProductByCategoryId);
router.get("/products/indepartment/:department_id",require("./routes/product").productDepartmentByDepartmentId);
router.get("/products/indepartment/:department_id",require("./routes/product").productDepartmentByDepartmentId);
router.get("/products/:product_id/details",require("./routes/product").product_detail)
router.get("/products/:product_id/locations",require("./routes/product").product_location)
router.get("/products/:product_id/get_reviews",require("./routes/product").product_review_get)
router.post("/products/:product_id/post_reviews",require("./routes/product").product_review_post)

//customer
router.post("/register_customer",require("./routes/customer").register_customer);
router.post("/login_customer",require("./routes/customer").login_customer);
router.get("/customer/:id",require("./routes/customer").customerById);
router.put("/update_customer",require("./routes/customer").update_customer);
router.put("/update_customer/address",require("./routes/customer").update_address);
router.put("/update_customer/credit_card",require("./routes/customer").update_credit_card);

//order
router.post("/order/:product_id/:quantity/:attributes/:shipping_id/:tax_id",require("./routes/order").post_order);
router.get("/order_detail/:order_id",require("./routes/order").order_detailsById);
router.get("/short_order_detail/:order_id",require("./routes/order").short_order_detailById);
router.get("/orders",require("./routes/order").order_detailsByCustomerId);

//shipping
router.get("/shoppingCart/generateUniqueId",require("./routes/shopping_cart").generateUniqueId);
router.post("/shoppingCart/add",require("./routes/shopping_cart").addShoppingCart);
router.get("/shoppingCart/:cart_id",require("./routes/shopping_cart").shoppingCartById);
router.put("/shoppingCart/update/:item_id",require("./routes/shopping_cart").updateShoppingCartById);
router.delete("/shoppingCart/delete/:cart_id",require("./routes/shopping_cart").deleteShoppingCartById);
router.post("/save_for_later",require("./routes/shopping_cart").saveForLater);
router.get("/shoppingCart/moveToCart/:item_id",require("./routes/shopping_cart").moveCartById);
router.delete("/shoppingCart/removeProduct/:item_id",require("./routes/shopping_cart").removeProductById);
router.get("/shoppingCart/get_saved_for_later/:cart_id",require("./routes/shopping_cart").getProductFromSavedForLater);
router.get("/shoppingCart/total_amount/:item_id",require("./routes/shopping_cart").totalAmount);

// deferent routing Style
require("./routes/tax")(router, knex)
require("./routes/shipping")(router, knex)
module.exports = router;