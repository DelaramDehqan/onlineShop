import { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  Typography,
  MenuItem,
  Select,
  FormControl,
  TextField,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { getGroup } from "api/groups.api";
import http from "services/http.service";
import modules from "./ProductsModal.module.scss";
import { patchProduct } from "api/products.api";
import { postProduct } from "api/products.api";
// import styles from "PanelLogin/login.module.scss";
import { TextEditor } from "./index";

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 600,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: "#ffe6e6",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4),
    borderRadius: "0.5rem",
  },
  productInputTitle: {
    fontFamily: "AMitra",
  },
  modalHeader: {
    width: "100%",
    display: "flex",
    fontFamily: "AMitra",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontWeight: "bolder",
  },
  productGroup: {
    width: "120px",
    display: "flex",
    direction: "rtl",
    marginBottom: "20px",
  },
  selectInput: {
    height: "5rem",
  },
  modalCloseButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#800000",
    width: "25px",
    height: "25px",
    border: "none",
  },
  productInputContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    direction: "rtl",
    marginBottom: "20px",
    width: "auto",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    marginTop: "60px",
  },
  productInoutLabel: {
    margin: "0 0 5px 0",
  },
  productImageContainer: {
    width: "50px",
    height: "50px",
    overflow: "hidden",
  },
  priceAndQuantityContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

const ProductModal = (props) => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);

  const [productState, setProductState] = useState({
    product: {
      id: "",
      name: "",
      group: "",
      headgroup: "",
      image: "",
      price: "",
      quantity: "",
      description: "",
    },
  });

  const setProductDescription = (val) => {
    setProductState({ product: { ...productState.product, description: val } });
  };

  const [groupsState, setGroupsState] = useState([]);

  const handleOpen = async () => {
    setOpen(true);
    const groups = await getGroup();
    await setGroupsState(groups.data);
  };

  const handleClose = () => {
    setOpen(false);
    setMode("default");
  };

  const inputChangeHandler = (event, name) => {
    if (name == "quantity" || name == "price") {
      if (event.target.value < 0) {
        toast.error("مقدار نمی تواند منفی باشد.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        event.target.value = 0;
      }
    }
    setProductState({
      product: { ...productState.product, [name]: event.target.value },
    });
  };

  const imageChangeHandler = (event, name) => {
    event.preventDefault();
    const data = new FormData();
    data.append("image", event.target.files[0]);
    try {
      http
        .post("/upload", data)
        .then((res) => {
          setImages([...images, `${res.data.filename}`]);
          setProductState({
            product: { ...productState.product, [name]: images },
          });
          toast.success("تصویر با موفقیت بارگذاری شد.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((e) => {
          toast.error("خطا در بارگذاری تصویر", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } catch (e) {
      toast.error("خطا در بارگذاری تصویر", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    const getGroups = async () => {
      const groups = await getGroup();
      await setGroupsState(groups.data);
      await props.setModalOpenHandler({ modalHandler: handleOpen });
    };
    getGroups();
  }, []);

  useEffect(() => {
    const changeMode = async () => {
      if (props.mode === "edit") {
        const { id, name, group, headgroup, image, description } =
          props.product;
        await setProductState({
          product: { id, name, group, headgroup, image, description },
        });
      }
      if (props.mode === "add")
        await setProductState({
          product: {
            id: "",
            name: "",
            group: "",
            headgroup: "",
            image: "",
          },
        });
    };
    changeMode();
  }, [props.mode]);

  const inputEl = useRef(null);

  const submitButtonHandler = async (event, product) => {
    event.preventDefault();
    const { mode } = props;
    const { name, description, group, id, price } = product;
    let operationSuccess = false;
    if (mode === "edit") {
      const headgroup = groupsState.find((g) => g.name === group).headgroup;
      const dataToSend = {
        image: images,
        name: name,
        group: group,
        headgroup: headgroup,
        description: description,
        price: price,
        quantity: quantity,
      };

      await patchProduct(dataToSend, id).then(() => {
        toast.success("کالای مورد نظر با موفقیت ویرایش شد.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
      operationSuccess = true;
    } else if (mode === "add") {
      if (name && group && description && price && quantity) {
        const headgroup = groupsState.find((g) => g.name === group).headgroup;
        const dataToSend = {
          image: images,
          name: name,
          group: group,
          headgroup: headgroup,
          description: description,
          price: price,
          quantity: quantity,
        };
        await postProduct(dataToSend).then(() => {
          toast.success("کالای مورد نظر با موفقیت اضافه شد.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });

        operationSuccess = true;
      } else {
        toast.error("وارد کردن تمامی فیلدها الزامی است.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        operationSuccess = false;
      }
    }
    if (operationSuccess) {
      setTimeout(() => window.location.reload(), 3000);
    }
  };

  const { id, name, description, group, price, quantity } =
    productState.product;
  const body = (
    <div className={classes.paper} style={modalStyle}>
      <header className={classes.modalHeader}>
        <button
          type="button"
          onClick={handleClose}
          className={classes.modalCloseButton}
        >
          <Cancel />
        </button>
        <Typography className={classes.productInputTitle}>
          افزودن / ویرایش کالا
        </Typography>
      </header>
      <form
        onSubmit={(event) => submitButtonHandler(event, productState.product)}
      >
        <div className={classes.productInputContainer}>
          <label className={classes.productInoutLabel}>نام کالا:</label>
          <TextField
            dir="rtl"
            placeholder="مثال : مافین نارگیلی"
            type="text"
            variant="outlined"
            value={name}
            onChange={(event) => inputChangeHandler(event, "name")}
          />
        </div>

        <form style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              flexGrow: 1,
            }}
          >
            <label className={classes.productInoutLabel}>:تصویر کالا</label>
            <label className={modules.input_file_label}>
              <span className={modules.upload_button}>انتخاب تصویر</span>
              <input
                ref={inputEl}
                id="input"
                type="file"
                className={modules.input_file}
                accept="image/*"
                onChange={(event) => {
                  imageChangeHandler(event, "image");
                }}
              />
              <span className={modules.file_name}>تصویر</span>
            </label>
          </div>
        </form>

        <div className={classes.priceAndQuantityContainer}>
          <FormControl className={classes.productGroup}>
            <label className={classes.productInoutLabel}>دسته بندی:</label>
            <Select
              className={classes.selectInput}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              variant="outlined"
              value={group}
              onChange={(event) => inputChangeHandler(event, "group")}
            >
              {groupsState.length > 0
                ? groupsState.map((group) => (
                    <MenuItem
                      style={{ fontSize: "1.5rem" }}
                      key={id}
                      value={group.name}
                    >
                      {group.name}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>

          {props.mode === "add" ? (
            <>
              <div className={classes.productInputContainer}>
                <label className={classes.productInoutLabel}>موجودی:</label>
                <TextField
                  InputProps={{ inputProps: { min: 0 } }}
                  style={{ width: "180px" }}
                  dir="rtl"
                  type="number"
                  variant="outlined"
                  value={quantity}
                  onChange={(event) => inputChangeHandler(event, "quantity")}
                />
              </div>

              <div className={classes.productInputContainer}>
                <label className={classes.productInoutLabel}>قیمت:</label>
                <TextField
                  InputProps={{ inputProps: { min: 0 } }}
                  style={{ width: "180px" }}
                  dir="rtl"
                  type="number"
                  variant="outlined"
                  value={price}
                  onChange={(event) => inputChangeHandler(event, "price")}
                />
              </div>
            </>
          ) : null}
        </div>

        <div id="textEditorSection" className={classes.productInputContainer}>
          <label className={classes.productInoutLabel}>توضیحات کالا:</label>
          <TextEditor
            handleChange={setProductDescription}
            defaultText={description}
          />
        </div>

        <footer className={classes.modalFooter}>
          <Button type="submit" color="primary" background="primary!important">
            ذخیره
          </Button>
        </footer>
      </form>
    </div>
  );

  const { setMode } = props;
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onClose={handleClose}
      >
        {body}
      </Modal>
    </div>
  );
};

export { ProductModal };
