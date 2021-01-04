const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/computer-room', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const User = mongoose.model('User', userSchema)

const computerSchema = mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    computer_number: {
        type: String,
        required: true
    },
    room_number: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        required: true
    }
})
const Computer = mongoose.model('Computer', computerSchema)
const StudentSchema = mongoose.Schema({
    student_number: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    class_number: {
        type: String,
        required: true
    }
})
const Student = mongoose.model('Student', StudentSchema)
const ComOperationBaInfoSchema = mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    operate_date: {
        type: Number,
        default: 1512962370
    },
    start_time: {
        type: Number,
        default: 1512962370
    },
    end_time: {
        type: Number,
        default: 1512962370
    },
    student_number: {
        type: String,
        required: true
    },
})
const ComOperationBaInfo = mongoose.model('ComOperationBaInfo', ComOperationBaInfoSchema)
const StudentPaySchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    pay_time: {
        type: Number,
        default: 1512962370
    },
    amount: {
        type: Number,
        required: true
    },
    agent: {
        type: String,
        required: true
    }
})
const StudentPay = mongoose.model("StudentPay", StudentPaySchema)
const ReportSchema = mongoose.Schema({
    value: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

const RightSchema = mongoose.Schema({
    authName: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        enum: [1, 2, 3]
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId
    }

})
const Right = mongoose.model("Right", RightSchema)
const RoleSchema = mongoose.Schema({
    roleName: {
        type: String,
        required: true
    },
    roleDesc: {
        type: String,
        required: true
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    role_rights: [{
            authName: {
                type: String
            }

        }


    ]

})
const Role = mongoose.model("Role", RoleSchema)
const RoomInfoSchema = mongoose.Schema({
    room_number: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    isFree: {
        type: Boolean,
        default: true
    },
    break_computer_count: {
        type: Number,
        required: true
    }

})
const RoomInfo = mongoose.model("RoomInfo", RoomInfoSchema)
const Report = mongoose.model("Report", ReportSchema)
exports.User = User
exports.Computer = Computer
exports.Student = Student
exports.StudentPay = StudentPay
exports.RoomInfo = RoomInfo
exports.Right = Right
exports.Role = Role
exports.Report = Report
exports.ComOperationBaInfo = ComOperationBaInfo