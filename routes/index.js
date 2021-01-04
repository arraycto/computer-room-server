const express = require("express");
const router = express.Router();
const md5 = require("blueimp-md5");
const {
  User,
  Student,
  Computer,
  StudentPay,
  Report,
  Right,
  Role,
  RoomInfo,
} = require("../db/models");
const filter = {
  password: 0,
  __v: 0,
}; // 指定过滤的属性

/* 用户注册 /register*/
router.post("/register", (req, res, next) => {
  // 获取请求参数
  const { username, password } = req.body;
  // 判断用户是否已经存在
  User.findOne(
    {
      username,
    },
    (err, user) => {
      if (user) {
        res.send({
          code: 1,
          msg: "此用户已存在",
        });
      } else {
        new User({
          username,
          password: md5(password),
        }).save((err, user) => {
          const data = {
            username,
            _id: user._id,
          };
          res.cookie("userid", user._id, {
            maxAge: 1000 * 60 * 60 * 24,
          });
          res.send({
            code: 0,
            data,
            msg: "注册成功",
          });
        });
      }
    }
  );
});

/* 用户登录 /login*/
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne(
    {
      username,
      password: md5(password),
    },
    filter,
    (err, user) => {
      if (!user) {
        res.send({
          code: 1,
          msg: "用户名或密码不正确",
        });
      } else {
        res.cookie("userid", user._id, {
          maxAge: 1000 * 60 * 60 * 24,
        });
        res.send({
          code: 0,
          msg: "登录成功",
          data: user,
        });
      }
    }
  );
});
/* 获取当前登录用户 /getUser*/
router.get("/getUser", (req, res, next) => {
  const _id = req.query.token;
  User.findById(
    {
      _id: _id,
    },
    filter,
    (err, user) => {
      res.send({
        code: 0,
        data: user,
      });
    }
  );
});
/* 添加学生 /addstudent*/
router.post("/addstudent", (req, res, next) => {
  const { name, student_number, sex, class_number } = req.body;
  Student.findOne(
    {
      student_number,
    },
    (err, student) => {
      if (student) {
        res.send({
          code: 1,
          msg: "该学生已存在",
        });
      } else {
        new Student({
          name,
          student_number,
          sex,
          class_number,
        }).save((err, data) => {
          res.send({
            code: 0,
            data,
            msg: "添加成功",
          });
        });
      }
    }
  );
});
/* 修改学生信息 /updateStudent*/
router.put("/updateStudent", (req, res, next) => {
  const { _id } = req.body;
  const student = req.body;
  Student.findByIdAndUpdate(
    {
      _id,
    },
    student,
    (err, oldStudent) => {
      if (!oldStudent) {
        res.send({
          code: 1,
          msg: "该学生信息不存在",
        });
      }
      const { name, sex, student_number, class_number } = oldStudent;
      const data = Object.assign(
        {
          name,
          sex,
          student_number,
          class_number,
        },
        student
      );
      res.send({
        code: 0,
        data,
        msg: "更新成功",
      });
    }
  );
});
/* 查找学生 /getStudent*/
router.get("/getStudent", (req, res, next) => {
  const _id = req.query._id;
  Student.findById(
    {
      _id: _id,
    },
    (err, student) => {
      res.send({
        code: 0,
        data: student,
      });
    }
  );
});
/* 删除学生 /delStudent*/
router.delete("/delStudent", (req, res, next) => {
  const { _id } = req.query;
  Student.findOneAndDelete(
    {
      _id,
    },
    (err, data) => {
      res.send({
        code: 0,
        data,
        msg: "删除成功",
      });
    }
  );
});
/* 获取学生信息列表 /studentlist*/
router.get("/studentlist", (req, res, next) => {
  const { query, pagenum, pagesize } = req.query;
  let skip = (pagenum - 1) * pagesize;
  let params = {};
  const queryTrim = query.trim();
  if (queryTrim == "" || query == 0) {
    params = {};
  } else {
    params = {
      name: {
        $regex: queryTrim,
      },
    };
  }

  let student = Student.find(params)
    .skip(skip)
    .limit(pagesize * 1);
  Student.find(params, (err, doc) => {
    if (err) {
      res.send({
        code: 1,
        message: err.message,
      });
    } else {
      let total = doc.length;
      student.exec((err, result) => {
        if (err) {
          res.send({
            code: 1,
            message: err.message,
          });
        } else {
          res.send({
            code: 0,
            message: "",
            data: {
              total: total,
              StudentList: result,
              pagenum: pagenum,
            },
          });
        }
      });
    }
  });
});

/* 添加计算机 /addcomputer*/
router.post("/addcomputer", (req, res, next) => {
  const { ip, computer_number, room_number, brand } = req.body;
  Computer.findOne(
    {
      computer_number,
    },
    (err, student) => {
      if (student) {
        res.send({
          code: 1,
          msg: "该计算机已存在",
        });
      } else {
        new Computer({
          ip,
          computer_number,
          room_number,
          brand,
        }).save((err, data) => {
          res.send({
            code: 0,
            data,
            msg: "添加成功",
          });
        });
      }
    }
  );
});
/* 修改计算机信息 /updateComputer*/
router.put("/updateComputer", (req, res, next) => {
  const { _id } = req.body;
  const computer = req.body;
  Computer.findByIdAndUpdate(
    {
      _id,
    },
    computer,
    (err, oldComputer) => {
      if (!oldComputer) {
        res.send({
          code: 1,
          msg: "该计算机信息不存在",
        });
      }
      const { ip, computer_number, room_number, brand } = oldComputer;
      const data = Object.assign(
        {
          ip,
          computer_number,
          room_number,
          brand,
        },
        computer
      );
      res.send({
        code: 0,
        data,
        msg: "更新成功",
      });
    }
  );
});
/* 查找计算机 /getComputer*/
router.get("/getComputer", (req, res, next) => {
  const _id = req.query._id;
  Computer.findById(
    {
      _id: _id,
    },
    (err, computer) => {
      res.send({
        code: 0,
        data: computer,
      });
    }
  );
});
/* 删除计算机 /delComputer*/
router.delete("/delComputer", (req, res, next) => {
  const { _id } = req.query;
  Computer.findOneAndDelete(
    {
      _id,
    },
    (err, data) => {
      res.send({
        code: 0,
        data,
        msg: "删除成功",
      });
    }
  );
});
/* 获取计算机信息列表 /computerlist*/
router.get("/computerlist", (req, res, next) => {
  const { query, pagenum, pagesize } = req.query;
  let skip = (pagenum - 1) * pagesize;
  let params = {};
  const queryTrim = query.trim();
  if (queryTrim == "" || query == 0) {
    params = {};
  } else {
    params = {
      computer_number: {
        $regex: queryTrim,
      },
    };
  }

  let computer = Computer.find(params)
    .skip(skip)
    .limit(pagesize * 1);
  Computer.find(params, (err, doc) => {
    if (err) {
      res.send({
        code: 1,
        message: err.message,
      });
    } else {
      let total = doc.length;
      computer.exec((err, result) => {
        if (err) {
          res.send({
            code: 1,
            message: err.message,
          });
        } else {
          res.send({
            code: 0,
            message: "",
            data: {
              total: total,
              ComputerList: result,
              pagenum: pagenum,
            },
          });
        }
      });
    }
  });
});
/* 更改计算机状态 /updateComputerState*/
router.put("/updateComputerState", (req, res, next) => {
  const { _id, state } = req.body;
  Computer.findByIdAndUpdate(
    {
      _id,
    },
    {
      state,
    },
    (err, oldComputer) => {
      if (!oldComputer) {
        res.send({
          code: 1,
          msg: "该计算机信息不存在",
        });
      }
      const { ip, computer_number, room_number, brand, state } = oldComputer;
      const data = Object.assign(
        {
          ip,
          computer_number,
          room_number,
          brand,
          state,
        },
        {
          state,
        }
      );
      res.send({
        code: 0,
        data,
        msg: "更新状态成功",
      });
    }
  );
});

/* 添加学生充值 /addStudentPay*/
router.post("/addStudentPay", (req, res, next) => {
  const { amount, agent, username } = req.body;
  StudentPay.findOne(
    {
      username,
    },
    (err, studentpay) => {
      if (studentpay) {
        res.send({
          code: 1,
          msg: "该学生充值信息已存在",
        });
      } else {
        new StudentPay({
          amount,
          agent,
          username,
        }).save((err, data) => {
          res.send({
            code: 0,
            data,
            msg: "添加成功",
          });
        });
      }
    }
  );
});
/* 获取学生充值 /getStudentPay*/
router.get("/getStudentPay", (req, res, next) => {
  const { query, pagenum, pagesize } = req.query;
  let skip = (pagenum - 1) * pagesize;
  let params = {};
  const queryTrim = query.trim();
  if (queryTrim == "" || query == 0) {
    params = {};
  } else {
    params = {
      username: {
        $regex: queryTrim,
      },
    };
  }

  let studentpay = StudentPay.find(params)
    .skip(skip)
    .limit(pagesize * 1);
  StudentPay.find(params, (err, doc) => {
    if (err) {
      res.send({
        code: 1,
        message: err.message,
      });
    } else {
      let total = doc.length;
      studentpay.exec((err, result) => {
        if (err) {
          res.send({
            code: 1,
            message: err.message,
          });
        } else {
          res.send({
            code: 0,
            message: "",
            data: {
              total: total,
              StudentPayList: result,
              pagenum: pagenum,
            },
          });
        }
      });
    }
  });
});
/* 修改学生充值金额 /updateAmount*/
router.put("/updateAmount", (req, res) => {
  const { amount, _id } = req.body;
  StudentPay.findByIdAndUpdate(
    {
      _id,
    },
    {
      amount,
    },
    (err, oldStudentPay) => {
      if (!oldStudentPay) {
        res.send({
          code: 1,
          msg: "该充值记录不存在",
        });
      }
      const { agent, amount, username, pay_time } = oldStudentPay;
      const data = Object.assign(
        {
          agent,
          amount,
          username,
          pay_time,
        },
        {
          amount,
        }
      );
      res.send({
        code: 0,
        data,
        msg: "更新成功",
      });
    }
  );
});
/* 获取学生充值金额 /getAmount*/
router.get("/getAmount", (req, res) => {
  const { _id } = req.query;
  StudentPay.findById(
    {
      _id,
    },
    (err, data) => {
      res.send({
        code: 0,
        data,
      });
    }
  );
});
/* 删除充值记录 /deletePay*/
router.delete("/deletePay", (req, res) => {
  const { _id } = req.query;
  StudentPay.findByIdAndRemove(
    {
      _id,
    },
    (err, data) => {
      res.send({
        code: 0,
        data,
        msg: "成功删除充值记录",
      });
    }
  );
});

/* 获取机房信息 /getRoomInfoList*/
router.get("/getRoomInfoList", (req, res) => {
  const { query, pagenum, pagesize } = req.query;
  let skip = (pagenum - 1) * pagesize;
  let params = {};
  const queryTrim = query.trim();
  if (queryTrim == "" || query == 0) {
    params = {};
  } else {
    params = {
      room_number: {
        $regex: queryTrim,
      },
    };
  }

  let roominfo = RoomInfo.find(params)
    .skip(skip)
    .limit(pagesize * 1);
  RoomInfo.find(params, (err, doc) => {
    if (err) {
      res.send({
        code: 1,
        message: err.message,
      });
    } else {
      let total = doc.length;
      roominfo.exec((err, result) => {
        if (err) {
          res.send({
            code: 1,
            message: err.message,
          });
        } else {
          res.send({
            code: 0,
            message: "",
            data: {
              total: total,
              RoomInfoList: result,
              pagenum: pagenum,
            },
          });
        }
      });
    }
  });
});
/* 添加机房信息 /addRoomInfo*/
router.post("/addRoomInfo", (req, res) => {
  const { room_number, break_computer_count, capacity } = req.body;
  RoomInfo.findOne(
    {
      room_number,
    },
    (err, roominfo) => {
      if (roominfo) {
        res.send({
          code: 1,
          msg: "该机房信息已存在",
        });
      } else {
        new RoomInfo({
          room_number,
          break_computer_count,
          capacity,
        }).save((err, data) => {
          res.send({
            code: 0,
            data,
            msg: "添加成功",
          });
        });
      }
    }
  );
});
/* 修改空闲状态 /updateFreeState*/
router.put("/updateFreeState", (req, res) => {
  const { _id, isFree } = req.body;
  RoomInfo.findByIdAndUpdate(
    {
      _id,
    },
    {
      isFree,
    },
    (err, oldRoomInfo) => {
      if (!oldRoomInfo) {
        res.send({
          code: 1,
          msg: "该机房信息不存在",
        });
      }
      const {
        room_number,
        capacity,
        isFree,
        break_computer_count,
      } = oldRoomInfo;
      const data = Object.assign(
        {
          room_number,
          capacity,
          isFree,
          break_computer_count,
        },
        {
          isFree,
        }
      );
      res.send({
        code: 0,
        data,
        msg: "更新状态成功",
      });
    }
  );
});
/* 删除机房信息 /deleteRoomInfo*/
router.delete("/deleteRoomInfo", (req, res) => {
  const { _id } = req.query;
  RoomInfo.findByIdAndRemove(
    {
      _id,
    },
    (err, data) => {
      res.send({
        code: 0,
        data,
        msg: "成功删除机房信息",
      });
    }
  );
});
/* 查找机房 /getRoomInfo*/
router.get("/getRoomInfo", (req, res, next) => {
  const _id = req.query._id;
  RoomInfo.findById(
    {
      _id: _id,
    },
    (err, roominfo) => {
      res.send({
        code: 0,
        data: roominfo,
      });
    }
  );
});
/* 修改机房信息 /updateRoomInfo*/
router.put("/updateRoomInfo", (req, res, next) => {
  const { _id } = req.body;
  const roominfo = req.body;
  RoomInfo.findByIdAndUpdate(
    {
      _id,
    },
    roominfo,
    (err, oldRoomInfo) => {
      if (!oldRoomInfo) {
        res.send({
          code: 1,
          msg: "该机房信息不存在",
        });
      }
      const {
        room_number,
        capacity,
        isFree,
        break_computer_count,
      } = oldRoomInfo;
      const data = Object.assign(
        {
          room_number,
          capacity,
          isFree,
          break_computer_count,
        },
        roominfo
      );
      res.send({
        code: 0,
        data,
        msg: "更新成功",
      });
    }
  );
});

/* 获取权限列表 /getRights*/
router.get("/getRights", (req, res) => {
  Right.find((err, data) => {
    res.send({
      code: 0,
      data,
    });
  });
});

/* 获取角色列表 /getRoles*/
router.get("/getRoles", (req, res) => {
  Role.aggregate(
    [
      {
        $lookup: {
          from: "rights",
          localField: "role_id",
          foreignField: "role_id",
          as: "rights",
        },
      },
    ],
    (err, docs) => {
      res.send({
        code: 0,
        data: JSON.stringify(docs),
      });
    }
  );
});
/* 分配权限 /setRight*/
router.post("/setRight", (req, res) => {
  let { rights, _id } = req.body;
  let arr = [];
  for (let i = 0; i < rights.length; i++) {
    arr.push({
      authName: rights[i],
    });
  }
  Role.updateOne(
    {
      _id,
    },
    {
      $addToSet: {
        role_rights: {
          $each: [...arr],
        },
      },
    },
    (err, data) => {
      if (err) {
        return res.send({
          code: 1,
          msg: "不能分配重复权限",
        });
      } else {
        res.send({
          code: 0,
          msg: "成功分配权限",
          data,
        });
      }
    }
  );
});
/* 移除权限 /removeRight*/
router.put("/removeRight", (req, res) => {
  const { _id } = req.body;
  console.log(_id);
  Role.updateOne(
    {
      _id,
    },
    {
      $pop: {
        role_rights: 1,
      },
    },
    (err, data) => {
      res.send({
        code: 0,
        data,
      });
    }
  );
});
/* 删除角色 /delRole*/
router.delete("/delRole", (req, res) => {
  const { _id } = req.query;
  Role.findByIdAndRemove(
    {
      _id,
    },
    (err, data) => {
      res.send({
        code: 0,
        data,
      });
    }
  );
});

/* 获取数据统计 /getReport*/
router.get("/getReport", (req, res) => {
  Report.find((err, data) => {
    res.send({
      code: 0,
      data,
    });
  });
});
module.exports = router;
