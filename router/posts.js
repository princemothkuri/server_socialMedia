const router = require("express").Router();
const User = require("../models/userSchema");
const Post = require("../models/PostSchema");
const authenticate = require("../middleware/authenticate");

// ------to get all posts from posts collection-------------
router.post("/", authenticate, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    if (!posts) {
      return res.status(400).json({ status: 400, error: "No posts" });
    }

    return res.status(201).json({ status: 201, message: posts });
  } catch (err) {
    console.error(err);
  }
});

// --------------create post of a current user---------------
router.post("/post", authenticate, async (req, res) => {
  const { pic, description } = req.body;

  console.log(description);
  try {
    const newPost = new Post({
      image: pic,
      description: description,
      username: req.rootUser.username,
      user: req.userID,
    });

    await newPost.save();
    return res.status(201).json({ status: 201, message: "post sent!" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: 400, error: "post not sent!" });
  }
});

// ------------delete the posted post of a current user--------------
router.delete("/", authenticate, async (req, res) => {
  try {
    const user = await Post.findById(req.body.id);

    if (!user) {
      return res.status(400).json({ status: 400, error: "post not found!" });
    }

    if (user.user.toString() !== req.userID.toString()) {
      return res
        .status(401)
        .json({ status: 401, error: "user not authorized!" });
    }

    await Post.findOneAndRemove({ _id: req.body.id });

    return res.status(201).json({ status: 201, message: "post removed!" });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ error: "post not found!" });
    }
    return res.status(500).json({ error: "Server error!" });
  }
});

// -------get the post by its ID---------------
router.post("/postid", authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.body.id);

    if (!post) {
      return res.status(404).json({ status: 404, error: "Post not found!" });
    }

    return res.status(201).json({ status: 201, post });
  } catch (err) {
    console.error(err);
  }
});

router.post("/comment", authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.body.id);

    const postComment = {
      user: req.userID,
      comment: req.body.comment,
      username: req.body.username,
    };
    post.comments.push(postComment);

    await post.save();

    return res
      .status(201)
      .json({ status: 201, message: "Commented successfully!" });
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({ status: 400, error: "Comment not posted!" });
  }
});

// ----------like a post--------
router.put("/like", authenticate, async (req, res) => {
  var count = 0;
  try {
    const post = await Post.findById(req.body.id);

    //check if the post is already liked
    post.likes.filter((like) => {
      if (!like.user.toString().localeCompare(req.userID)) {
        count = count + 1;
      }
    });

    if (count > 0) {
      return res
        .status(400)
        .json({ status: 400, error: "you have already liked!" });
    }

    post.likes.unshift({ user: req.userID });

    await post.save();

    return res
      .status(201)
      .json({ status: 201, message: "you liked the post!" });
  } catch (err) {
    console.error(err.meaasge);
  }
});

// --------unlike a post---------------
router.put("/unlike", authenticate, async (req, res) => {
  var count = 0;
  try {
    const post = await Post.findById(req.body.id);

    // ----checking if the post is liked, if liked removing the like----------
    post.likes.filter((like) => {
      if (!like.user.toString().localeCompare(req.userID)) {
        count = count + 1;
      }
    });
    if (count > 0) {
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.userID);
      post.likes.splice(removeIndex, 1);

      await post.save();
    }

    return res.status(201).json({ status: 201, message: "unLiked post" });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
