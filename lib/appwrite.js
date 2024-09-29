import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ansul.aora",
  projectId: "66f52c08003b66cfb0b4",
  databaseId: "66f52fc000368110fbca",
  userCollectionId: "66f5300600228680cebf",
  videoCollectionId: "66f5315f003e16a98c42",
  storageId: "66f530fa001fae06f7e9"
};

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform) 

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    
// Register user
    export async function createUser(email, password, username) {
        try {
          const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
          );
      
          if (!newAccount) throw Error;
      
          const avatarUrl = avatars.getInitials(username);
      
          await signIn(email, password);
      
          const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
              accountId: newAccount.$id,
              email: email,
              username: username,
              avatar: avatarUrl,
            }
          );
      
          return newUser;
        } catch (error) {
          throw new Error(error);
        }
      }
    
    // Sign In
      export const signIn = async (email, password) => {
        try {
          let currentSession;
          
          try {
            currentSession = await account.getSession("current");
          } catch (error) {
            // Handle session not found error here (this might be expected for a guest user)
          }
      
          if (currentSession) {
             // Set the user in global state
            return currentSession;
          } 
          const newSession = await account.createEmailPasswordSession(email, password);
          
          return newSession;
        } catch (error) {
          throw new Error(error.message); // Adjusted to error.message for clarity
        }
      }
      
      // Get Current User
      export const getCurrentUser = async () => {
        try {
            const currentAccount = await account.get();
    
            if(!currentAccount) throw Error;
    
            const currentUser = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                [Query.equal('accountId', currentAccount.$id)]
            )
    
            if(!currentUser) throw Error;
    
            return currentUser.documents[0]
        }catch (error) {
            console.log(error)
        }
      }
    
      // Get all video Posts
      export async function getAllPosts() {
        try {
          const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt")]
          );
      
          return posts.documents;
        } catch (error) {
          throw new Error(error);
        }
      }
    
      // Get latest created video posts
      export async function getLatestPosts() {
        try {
          const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
          );
      
          return posts.documents;
        } catch (error) {
          throw new Error(error);
        }
      }
    
      // Get video posts that matches search query
      export const searchPosts = async (query) => {
        try {
          const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search("title", query)]
          );
    
          return posts.documents;
        } catch (error) {
          throw new Error(error);
        }
      }
    
      // Get video posts created by user
      export const getUserPosts = async (userId) => {
        try {
          const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
          );
      
          return posts.documents;
        } catch (error) {
          throw new Error(error);
        }
      }
    
      // Sign Out
      export const signOut = async () => {
        try {
          const session = await account.deleteSession("current");
      
          return session;
        } catch (error) {
          throw new Error(error);
        }
      }
    
      // Get File Preview
      export const getFilePreview = async (fileId, type) => {
        let fileUrl;
    
        try {
          if(type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId)
          } else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId,
              fileId, 2000, 2000, 'top', 100)
          }else{
            throw new Error('Invalid file type')
          }
    
          if(!fileUrl) throw Error;
    
          return fileUrl;
        } catch (error) {
          throw new Error(error);
        }
    
      }
    
      // Upload File
      export const uploadFile = async (file, type) => {
        if(!file) return;
    
        const { mimeType, ...rest } = file;
        const asset = { type: mimeType, ...rest };
        try {
          const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
          )
          
        
          const fileUrl = await getFilePreview(uploadedFile.$id, type);
    
          return fileUrl;
        } catch (error) {
          throw new Error(error)
        }
      }
    
      // Create Video Post
      export const createVideoPost = async (form) => {
        try {
          const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
          ]);
          
          const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
              title: form.title,
              thumbnail: thumbnailUrl,
              video: videoUrl,
              prompt: form.prompt,
              creator: form.userId,
            }
          );
      
          return newPost;
        } catch (error) {
          throw new Error(error);
        }
      }