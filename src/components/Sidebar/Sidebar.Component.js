import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems:'flex-end',
        borderLeft:'1px solid gray'
    },
    groupTitle:{
        marginTop:theme.spacing(0),
        marginBottom:theme.spacing(1),
        textAlign:'right',
        color:'var(--russian-violet)'
    },
    groupCategory:{
        width:'80%',
        paddingRight:theme.spacing(2),
        color:'black',
        marginBottom:'3rem'
    },
    subGroupTitle:{
        textAlign:'right',
        marginBottom:theme.spacing(1),
        paddingRight:theme.spacing(2),
        color:'var(--lavender-floral)'
    },
    groupTitleLink:{
        color:'var(--lavender-floral)',
        textDecoration:'none'
    },
    groupCategoryLink:{
        textDecoration:'none'
    }
}));

const Sidebar = (props) => {
    const classes = useStyles();

    return (
        <section className={classes.container}>
            {
                props.groups.map(group=>{
                    const {groupId:id, products, group:name} = group
                    return (
                      <article className={classes.groupCategory} key={id}>
                        <h4 className={classes.groupTitle}>
                          <a
                            style={{
                              fontFamily: "AMitra",
                              fontSize: "2.4rem",
                              color: "black",
                            }}
                            className={classes.groupCategoryLink}
                            href={`/products/group/${id}/${name
                              .trim()
                              .replaceAll(" ", "-")}`}
                          >
                            {group.group} • 
                          </a>
                        </h4>
                        {products.map((prod) => {
                          const { name, id: prodId } = prod;
                          return (
                            <p className={classes.subGroupTitle} key={prodId}>
                              <a
                                className={classes.groupTitleLink}
                                style={{
                                  fontFamily: "AMitra",
                                  fontSize: "1.6rem",
                                  color: "black",
                                }}
                                href={`/product/${prodId}`}
                              >
                                {name}
                              </a>
                            </p>
                          );
                        })}
                      </article>
                    );
                })
            }
        </section>
    )
}

export {
    Sidebar
}