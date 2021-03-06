const Question = require('../models/Question');
const User = require('../models/User');
const TagMap = require('../models/TagMap');
const Tag = require('../models/Tag');
const QuestionAccess = require('../models/QuestionAccess');
const Notification = require('../models/Notification');
const FriendRequest = require('../models/FriendRequest');
const FriendMap = require('../models/FriendMap');
const Opt = require('../models/Otp');

Question.sync().then(() => {
    console.log('Question sync successfull');
}).catch(e => console.log(e));

User.sync().then(() => {
    console.log('User sync successfull')
})
.catch(e => console.log(e));

TagMap.sync().then(() => 
console.log('TagMap synced successfully'))
.catch((e) => console.log(e));

Tag.sync().then(() => {
    console.log('Tag synced successfully');
}).catch((e) => console.log(e));

QuestionAccess.sync().then(() => 
console.log('QuestionAccess synced successfully'))
.catch((e) => console.log(e));

Notification.sync().then(() => {
    console.log('Notification sync successfull');
}).catch(e => console.log(e));

FriendMap.sync().then(() => {
    console.log('FriendMap synced successfully');
}).catch(e => {
    console.log('FriendMap: ', e);
});

FriendRequest.sync().then(() => {
    console.log('FriendRequest synced successfully');
}).catch(e => {
    console.log('FriendRequest: ', e);
});

Opt.sync().then(() => {
    console.log('Opt synced successfully');
}).catch(e => console.log(e));
