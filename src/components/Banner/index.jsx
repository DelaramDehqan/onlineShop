import { Container, Typography, Grid } from "@material-ui/core";
import styles from "./Banner.module.scss";

const Banner = () => {
  return (
    <div className={styles.banner}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography className={styles.title} variant="h1"></Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export { Banner };
