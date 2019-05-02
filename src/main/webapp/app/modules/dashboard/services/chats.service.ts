import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UsersService } from 'app/modules/dashboard/services/users.service';

@Injectable({
    providedIn: 'root'
})
export class ChatsService {
    constructor(
        private http: HttpClient,
        private angularFirestore: AngularFirestore,
        private usersService: UsersService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    getChat(chatId) {
        return this.angularFirestore
            .collection<any>('chats')
            .doc(chatId)
            .snapshotChanges()
            .pipe(
                map(doc => {
                    return { id: doc.payload.id, ...doc.payload.data() };
                })
            );
    }

    getRecentChat(uid) {
        return this.angularFirestore
            .doc<any>('users/' + uid)
            .collection<any>('chat-rooms')
            .valueChanges();
    }

    getChatDetail(uid, chatId) {
        return this.angularFirestore.doc<any>(`users/${uid}/chat-rooms/${chatId}`).valueChanges();
    }

    getMessages(uid, chatId) {
        return this.angularFirestore
            .doc<any>('users/' + uid)
            .collection<any>('chat-rooms')
            .doc<any>(chatId)
            .collection<any>('messages')
            .valueChanges();
    }

    async createChat(user) {
        const uids = [];
        const myInfo = JSON.parse(localStorage.getItem('user'));
        this.fakeAvatarAndNameWithNormalAccount(myInfo);
        const chatId = Date.now();
        const createAt = Date.now();
        localStorage.setItem('chatId', String(chatId));
        uids.push(myInfo.uid);
        uids.push(user.uid);
        const chatDetail = {
            uids,
            createAt,
            avatar: user.photoURL,
            name: user.displayName,
            lastMessage: '',
            status: 'Online',
            isGroup: false
        };
        const chatDetailPartner = {
            uids,
            createAt,
            avatar: myInfo.photoURL,
            name: myInfo.displayName,
            lastMessage: '',
            status: 'Online',
            isGroup: false
        };
        const chatRef1: AngularFirestoreDocument = this.angularFirestore.doc(`users/${myInfo.uid}/chat-rooms/${chatId}`);
        const chatRef2: AngularFirestoreDocument = this.angularFirestore.doc(`users/${user.uid}/chat-rooms/${chatId}`);
        chatRef1.set(chatDetail, { merge: true });
        chatRef2.set(chatDetailPartner, { merge: true });
        return this.router.navigate(['/dashboard', { outlets: { chatDetail: [chatDetail.createAt] } }]);
    }

    async createGroupChat(groupInfo, currentListMember) {
        const newGroup = groupInfo;
        this.fakeAvatarAndNameOfNewGroupFromAddMember(newGroup);
        const uids = [];
        if (currentListMember !== null) {
            uids.push(currentListMember.uids.pop());
        }
        const myInfo = JSON.parse(localStorage.getItem('user'));
        this.fakeAvatarAndNameWithNormalAccount(myInfo);
        const createAt = Date.now();
        uids.push(myInfo.uid);
        for (let i = 0; i < newGroup.members.length; i++) {
            uids.push(newGroup.members[i].uid);
        }
        const chatId = Date.now();
        localStorage.setItem('chatId', String(chatId));
        for (let i = 0; i < uids.length; i++) {
            const chatDetailPartner = {
                uids,
                createAt,
                avatar: newGroup.group_avatar,
                name: newGroup.group_name,
                lastMessage: 'New group',
                status: 'Online',
                isGroup: true
            };
            const chatRef2: AngularFirestoreDocument = this.angularFirestore.doc(`users/${uids[i]}/chat-rooms/${chatId}`);
            chatRef2.set(chatDetailPartner, { merge: true });
        }
        const chatDetail = {
            uids,
            createAt,
            avatar: newGroup.group_avatar,
            name: newGroup.group_name,
            lastMessage: 'New group',
            status: 'Online',
            isGroup: true
        };
        const chatRef1: AngularFirestoreDocument = this.angularFirestore.doc(`users/${myInfo.uid}/chat-rooms/${chatId}`);
        chatRef1.set(chatDetail, { merge: true });
        return this.router.navigate(['/dashboard', { outlets: { chatDetail: [createAt] } }]);
    }

    updateMemberGroup(oldGroup, chatId, listMember, messageInfo) {
        for (let i = 0; i < oldGroup.uids.length; i++) {
            const addMember = this.angularFirestore.doc(`users/${oldGroup.uids[i]}/chat-rooms/${chatId}`);
            addMember.update({
                uids: listMember
            });
        }
        const newMembers = listMember.filter(x => !oldGroup.uids.includes(x)).concat(oldGroup.uids.filter(x => !oldGroup.uids.includes(x)));
        this.createGroupForNewMembers(newMembers, chatId, oldGroup, listMember);
        this.updateMessageForNewMembers(newMembers, chatId, messageInfo);
    }

    updateMessageForNewMembers(newMembers, chatId, messages) {
        for (let i = 0; i < newMembers.length; i++) {
            for (let j = 0; j < messages.length; j++) {
                const messageRef: AngularFirestoreDocument = this.angularFirestore.doc(
                    `users/${newMembers[i]}/chat-rooms/${chatId}/messages/${messages[j].messageId}`
                );
                const data = {
                    content: messages[j].content,
                    createAt: Date.now(),
                    uid: messages[j].uid,
                    isSender: false,
                    avatar: messages[j].avatar,
                    name: messages[j].name,
                    messageId: messages[j].messageId
                };
                messageRef.set(data, { merge: true });
            }
        }
    }

    createGroupForNewMembers(newMembers, chatId, oldGroup, listMember) {
        const chatDetail = {
            uids: listMember,
            createAt: chatId,
            avatar: oldGroup.avatar,
            name: oldGroup.name,
            lastMessage: 'New group',
            status: 'Online',
            isGroup: true
        };
        for (let i = 0; i < newMembers.length; i++) {
            const groupRef: AngularFirestoreDocument = this.angularFirestore.doc(`users/${newMembers[i]}/chat-rooms/${chatId}`);
            groupRef.set(chatDetail, { merge: true });
        }
    }

    fakeAvatarAndNameOfNewGroupFromAddMember(newGroup) {
        if (newGroup.group_name === undefined) {
            newGroup.group_name = 'New Group';
            newGroup.group_avatar =
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpPaZ0WeOP1yeT4le9avQ9OjV28LAkDbxZ4bDTSPcKKgTu_uZG';
        }
    }

    fakeAvatarAndNameWithNormalAccount(myInfo) {
        if (myInfo.displayName === null) {
            myInfo.displayName = myInfo.email.substring(0, myInfo.email.lastIndexOf('@'));
            myInfo.photoURL =
                'https://institutogoldenprana.com.br/wp-content/uploads/2015/08/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg';
        }
    }

    sendMessage(uids, chatId, message) {
        const messageId = Date.now();
        const myInfo = JSON.parse(localStorage.getItem('user'));
        this.fakeAvatarAndNameWithNormalAccount(myInfo);
        for (let i = 0; i < uids.length; i++) {
            const messageRef: AngularFirestoreDocument = this.angularFirestore.doc(
                `users/${uids[i]}/chat-rooms/${chatId}/messages/${messageId}`
            );
            if (uids[i] === JSON.parse(localStorage.getItem('user')).uid) {
                const data = {
                    content: message,
                    createAt: Date.now(),
                    uid: uids[i],
                    isSender: true,
                    avatar: myInfo.photoURL,
                    name: myInfo.displayName,
                    messageId
                };
                messageRef.set(data, { merge: true });
            } else {
                const dataPartner = {
                    content: message,
                    createAt: Date.now(),
                    uid: uids[i],
                    isSender: false,
                    avatar: myInfo.photoURL,
                    name: myInfo.displayName,
                    messageId
                };
                messageRef.set(dataPartner, { merge: true });
            }
        }
    }

    editMessage(uids, chatId, messageId, contentMessage) {
        for (let i = 0; i < uids.length; i++) {
            const editedMessage = this.angularFirestore.doc(`users/${uids[i]}/chat-rooms/${chatId}/messages/${messageId}`);
            editedMessage.update({
                content: contentMessage
            });
        }
    }

    deleteMessage(uids, chatId, messageId) {
        for (let i = 0; i < uids.length; i++) {
            const editedMessage = this.angularFirestore.doc(`users/${uids[i]}/chat-rooms/${chatId}/messages/${messageId}`);
            editedMessage.delete();
        }
    }
}
