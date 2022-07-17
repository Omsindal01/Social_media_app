import React, { useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Grid,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import CommentSection from "./CommentSection";
import { getPost, getPostsBySearch } from "../../actions/posts";
import useStyles from "./style";
export default function PostDetails() {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);
  useEffect(() => {
    if (post)
      dispatch(
        getPostsBySearch({ search: "none", tags: post?.tags.join(",") })
      );
  }, [post]);
  if (!post) return null;
  if (isLoading)
    return (
      <Paper className={classes.loadingPaper} elevation={6}>
        <CircularProgress size="7em" />
      </Paper>
    );
  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);
  const openPost = (_id) => navigate(`/posts/${_id}`);

  return (
    <>
      <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
        <div className={classes.card}>
          <div className={classes.section}>
            <Typography variant="h3" component="h2">
              {post.title}
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              color="textSecondary"
              component="h2"
            >
              {post.tags.map((tag) => `#${tag} `)}
            </Typography>
            <Typography gutterBottom variant="body1" component="p">
              {post.message}
            </Typography>
            <Typography variant="h6">Created by: {post.name}</Typography>
            <Typography variant="body1">
              {moment(post.createdAt).fromNow()}
            </Typography>
            <Divider style={{ margin: "20px 0" }} />
            <Typography variant="body1">
              <strong>Realtime Chat - coming soon!</strong>
            </Typography>
            <Divider style={{ margin: "20px 0" }} />
            <CommentSection post={post} />
            <Divider style={{ margin: "20px 0" }} />
          </div>
          <div className={classes.imageSection}>
            <img
              className={classes.media}
              src={
                post.selectedFile ||
                "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
              }
              alt={post.title}
            />
          </div>
        </div>
        {recommendedPosts.length > 0 && (
          <div className={classes.section}>
            <Typography gutterBottom variant="h5">
              You might also like:
            </Typography>
            <Divider />
            {/* <div className={classes.recommendedPosts}> */}
            <Grid
              className={classes.container}
              container
              alignItems="stretch"
              spacing={3}
            >
              {recommendedPosts.map((post) => (
                <Grid key={post._id} item xs={12} sm={12} md={6} lg={4} xl={3}>
                  <div
                    style={{ margin: "20px", cursor: "pointer" }}
                    key={post._id}
                    onClick={() => openPost(post._id)}
                  >
                    <Typography gutterBottom variant="h6">
                      {post.title}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2">
                      {post.name}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2">
                      {post.message.substr(0, 100) + "..."}
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                      Likes: {post.likes.length}
                    </Typography>
                    <img src={post.selectedFile} width="200px" />
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </Paper>
    </>
  );
}
