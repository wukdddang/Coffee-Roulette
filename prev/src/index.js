const express = require("express");
const mongoose = require("mongoose");
const { User, History } = require("./database/model");
const e = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

mongoose
  .connect(
    "mongodb+srv://roullet:1234@web-gis-db-1.ucq99vx.mongodb.net/roullet"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed!");
    console.log(err);
  });

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

/**
 * 전체 유저 목록을 조회합니다.
 * times 필드를 기준으로 내림차순 정렬합니다.
 * @returns {Array} users
 */
app.get("/user/list", async (req, res) => {
  try {
    // 최근 기록 3개를 가져옵니다.
    const latestHistory = await History.find().sort({ createdAt: -1 }).limit(3);

    if (latestHistory.length == 1) {
      // 한 건만 존재하면, 해당 유저의 가중치를 0.7로 설정합니다.
      const users = await User.find();
      users.forEach((user) => {
        if (user._id.toString() === latestHistory[0].user.toString()) {
          user.weight *= 0.7;
        }
      });
      users.sort(() => Math.random() - 0.5);
      return res.json({ success: true, users });
    }

    // latestHistory가 존재하지 않으면, 유저 목록을 랜덤으로 섞어 반환합니다.

    if (latestHistory.length < 2) {
      const users = await User.find();
      users.sort(() => Math.random() - 0.5);
      return res.json({ success: true, users });
    }

    // latestHistory 배열의 첫 번째와 두 번째 user_id가 같은지 확인합니다.
    const isSameUser =
      latestHistory[0].user.toString() === latestHistory[1].user.toString();
    const balanceWeight = isSameUser ? 0.5 : 0.7;

    // 유저 목록을 가져오고, 최근 기록에 따라 가중치를 적용합니다.
    let users = await User.find();
    users.forEach((user) => {
      if (user._id.toString() === latestHistory[0].user.toString()) {
        user.weight *= balanceWeight;
      }
    });

    // 유저를 랜덤으로 섞습니다.
    users.sort(() => Math.random() - 0.5);

    return res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res.json({ success: false });
  }
});

app.get("/user", async (req, res) => {
  const users = await User.find();

  // users.times 기준으로 내림차순 정렬
  users.sort((a, b) => b.times - a.times);

  res.render("users.ejs", { users });
});

/**
 * 유저를 생성합니다.
 * @param {string} name
 * @returns redirect to /user
 */
app.post("/user", (req, res) => {
  const name = req.body.name;

  const user = new User({
    name: name,
  });

  user.save().then((result) => {
    res.redirect("/user");
  });
});

/**
 * 특정 유저의 상세 정보를 조회합니다.
 * @param {string} id
 * @returns {Object} user
 */
app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findOne({ _id: id }).populate("histories", {
      createdAt: -1,
    });

    const winRate = ((user.times / user.participationCount) * 100).toFixed(2);

    console.log(winRate);
    res.render("detail", { user, winRate });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

/**
 * 특정 유저를 삭제합니다.
 * @param {string} id
 * @returns redirect to /user
 */
app.get("/user/delete/:id", async (req, res) => {
  const id = req.params.id;

  await User.findByIdAndDelete(id);

  res.redirect("/user");
});

app.get("/user/increase/:name", async (req, res) => {
  const name = req.params.name;

  const user = await User.findOne({ name: name });

  const history = new History({
    user: user._id,
  });

  user.times++;

  user.histories.push(history._id);

  await user.save();
  await history.save();

  return res.json({ success: true });
});

app.get("/user/increase/weight/:name", async (req, res) => {
  try {
    const name = req.params.name;

    const user = await User.findOne({ name: name });

    user.weight += 0.1;

    await user.save();

    return res.redirect("/user");
  } catch (error) {
    console.error(error);
    return res.json({ success: false });
  }
});

app.get("/user/decrease/weight/:name", async (req, res) => {
  try {
    const name = req.params.name;

    const user = await User.findOne({ name: name });

    user.weight -= 0.1;

    await user.save();

    return res.redirect("/user");
  } catch (error) {
    console.error(error);
    return res.json({ success: false });
  }
});

app.post("/user/increase/participation", async (req, res) => {
  try {
    const { participants } = req.body; // 요청 본문에서 참가자 목록 추출

    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({ message: "Invalid participants array" });
    }

    // 각 참가자의 participation 값을 +1 증가
    await Promise.all(
      participants.map(async (participate) => {
        await User.findOneAndUpdate(
          { name: participate.name },
          { $inc: { participationCount: 1 } },
          { new: true }
        );
      })
    );

    res.status(200).json({ message: "Participation updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
});

// clear all users times and histories
app.get("/admin/user/clear", async (req, res) => {
  const users = await User.find();

  users.forEach(async (user) => {
    user.times = 0;
    user.histories = [];
    await user.save();
  });

  await History.deleteMany();

  res.redirect("/user");
});

app.get("/admin/user/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    console.log(id);

    await User.findByIdAndDelete(id);

    return res.redirect("/user");
  } catch (error) {
    console.error(error);
    return res.json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
