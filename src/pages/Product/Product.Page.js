//package
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import { makeStyles, Typography } from "@material-ui/core";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

//components
import { UserLayout } from "layout";
import { Spinner } from "components";
import { getGroup } from "api/groups.api";
import { getProductWithId } from "api/products.api";
import { addToCart } from "redux/actions/card.action";
import { ToastContainer, toast } from "react-toastify";
import { cartSelector } from "redux/selects/user.select";
import { e2p } from "utils/LanguageNumberConvertor.utils";
import { numberWithCommas } from "utils/numberWithCommas.utils";

//style
const useStyles = makeStyles((theme) => ({
  productInfo: {
    width: "100%",
    marginTop: theme.spacing(7),
    color: "var(--russian-violet)",
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    fontFamily: "AMitra",
  },
  quantityInput: {
    width: "100px",
    height: "40px",
    lineHeight: "36px",
    fontFamily: "AMitra",
    backgroundColor: "#47d147",
    borderRadius: "4px",
    paddingLeft: 25,
    border: "2px solid var(--russian-violet)",
    boxSizing: "border-box",
    marginLeft: theme.spacing(2),
  },
  cartButton: {
    padding: 0,
    margin: 0,
    display: "flex",
    width: "200px",
    justifyContent: "space-evenly",
    backgroundColor: "#47d147",
    color: "var(--russian-violet)",
    borderRadius: "4px",
    border: "2px solid var(--russian-violet)",
    boxSizing: "border-box",
    height: "40px",
    lineHeight: "36px",
    fontFamily: "AMitra",
    cursor: "pointer",
  },
  lineHeight: {
    lineHeight: "40px",
    height: "40px",
    display: "inline-block",
    color: "white",
  },
  productMainInfo: {
    display: "flex",
    flexDirection: "row-reverse",
    width: "700px",
    fontFamily: "AMitra",
    margin: "1rem 4rem",
    alignItems: "center",
    gap: "15rem",
  },
  productCategory: {
    display: "flex",
    justifyContent: "flex-end",
    fontFamily: "AMitra",
    paddingRight: theme.spacing(2),
    margin: "15px 0",
  },
  productPrice: {
    textAlign: "right",
    fontFamily: "AMitra",
    paddingRight: theme.spacing(2),
    direction: "rtl",
  },
  productActions: {
    display: "flex",
    justifyContent: "space-between",
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  productDescription: {
    textAlign: "right",
    width: "700px",
    fontFamily: "AMitra",
    margin: "0 4rem",
    direction: "rtl",
  },
  productName: {
    paddingRight: theme.spacing(2),
    fontFamily: "AMitra",
    textAlign: "right",
  },
  productImage: {
    width: "300px",
    height: "300px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  productImageItem: {
    width: "100%",
  },
  productCategoryTitle: {
    display: "inline-flex",
    alignItems: "center",
    marginLeft: "20px",
    fontFamily: "AMitra",
  },
  productCategoryTitleLink: {
    textDecoration: "none",
    color: "var(--lavender-floral)",
  },
  productSubCategoryTitle: {
    display: "inline-flex",
    alignItems: "center",
    fontFamily: "AMitra",
    color: "var(--lavender-floral)",
  },
}));

const ProductPage = (props) => {
  const classes = useStyles();
  const [productsState, setProductsState] = useState({});
  const [cartcount, setCartCount] = useState({ quantity: 1 });
  const [loading, setLoading] = useState({ show: true });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProductsByGroup = async () => {
      const response = await getProductWithId(props.params.productId);
      const product = response.data;
      setQuantity(response.data.quantity);
      const groupResponse = await getGroup({ params: { name: product.group } });
      product.groupId = groupResponse.data[0].id;
      await setProductsState(product);
      setLoading({ show: false });
    };
    getProductsByGroup();
  }, []);

  const addToCartButtonClickHandler = async (event, product) => {
    const response = await getProductWithId(product.id, "");
    const productInCart = props.userCart.find((prod) => prod.id === product.id);
    if (response.data.quantity > 0)
      if (!productInCart || cartcount.quantity <= response.data.quantity) {
        props.addToCart(product, +cartcount.quantity);
        toast.success("کالا با موفقیت به سبد خرید اضافه شد.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    toast.error("متاسفانه موجودی محصول کافی نیست.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      rtl: true,
    });
  };

  const cartQuantityChangeHandler = (event, quantity) => {
    if (event.target.value < 1) {
      toast.error("مقدار نمی تواند کمتر از 1 باشد.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      event.target.value = 1;
    } else if (event.target.value > quantity) {
      toast.error("مقدار بیش از موجودی کالا می باشد.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      event.target.value = 1;
    } else {
      setCartCount({ quantity: event.target.value });
    }
  };

  const {
    name,
    description,
    image,
    group = "",
    headgroup,
    price,
    id,
    groupId = "",
  } = productsState;

  const pageContent = (
    <main>
      <section className={classes.productInfo}>
        <div className={classes.productMainInfo}>
          <div className={classes.productImage}>
            <img
              className={classes.productImageItem}
              src={`http://localhost:3001/files/${image}`}
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <Typography
              className={classes.productName}
              variant="h1"
              component="h1"
            >
              {name}
            </Typography>
            <div className={classes.productCategory}>
              <Typography
                variant="h2"
                component="p"
                className={classes.productSubCategoryTitle}
              >
                {headgroup}
              </Typography>
              <Typography
                variant="h2"
                component="p"
                className={classes.productCategoryTitle}
              >
                <ArrowLeftIcon style={{ color: "var(--lavender-floral)" }} />
                <Link
                  to={`/products/group/${groupId}/${group
                    .trim()
                    .replaceAll(" ", "-")}`}
                  className={classes.productCategoryTitleLink}
                >
                  {group}
                </Link>
              </Typography>
            </div>
            <Typography
              variant="h3"
              component="p"
              className={classes.productPrice}
            >
              {e2p(numberWithCommas("" + price))} تومـــان
            </Typography>
            <div className={classes.productActions}>
              <button
                className={[classes.cartButton]}
                onClick={(event) =>
                  addToCartButtonClickHandler(event, {
                    name,
                    price: +price,
                    id,
                  })
                }
              >
                <ControlPointIcon className={classes.lineHeight} />
                <div className={classes.lineHeight}>افزودن به سبد خریـد</div>
              </button>
              <input
                onChange={(event) =>
                  cartQuantityChangeHandler(event, props.quantity)
                }
                value={cartcount.quantity}
                max={quantity}
                min="1"
                className={classes.quantityInput}
                type="number"
              />
            </div>
          </div>
        </div>
        <Typography
          className={classes.productDescription}
          variant="h5"
          component="p"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </section>
    </main>
  );

  return (
    <div>
      <Helmet>
        <title>مشخصات محصول</title>
      </Helmet>
      <UserLayout>
        <Spinner isLoading={loading.show} content={pageContent} />
      </UserLayout>
      <ToastContainer rtl={true} />
    </div>
  );
};

const mapStateToProps = (state) => ({ userCart: cartSelector(state) });
const mapDispatchToProps = (dispatch) => ({
  addToCart: (product, count) => dispatch(addToCart(product, count)),
});

const Product = connect(mapStateToProps, mapDispatchToProps)(ProductPage);
export { Product };
