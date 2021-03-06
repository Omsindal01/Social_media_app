import React from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress } from "@material-ui/core";
import Post from "./Post/Post";
import useStyles from "./style";
export default function Posts({ setCurrentId }) {
  const classes = useStyles();
  const { posts, isLoading } = useSelector((state) => state.posts);
  if (!posts?.length && !isLoading) return "No Posts";

  console.log(posts);
  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid
          className={classes.container}
          container
          alignItems="stretch"
          spacing={3}
        >
          {posts.map((post) => (
            <Grid key={post._id} item xs={12} sm={12} md={6} lg={4}>
              <Post post={post} setCurrentId={setCurrentId} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
