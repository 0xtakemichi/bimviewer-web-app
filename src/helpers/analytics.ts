import { firebaseAnalytics } from '../firebase/index';
import { logEvent } from 'firebase/analytics';

export const trackUserLogin = (uid: string) => {
  logEvent(firebaseAnalytics, 'user_login', { user_id: uid });
  console.log(`Event user_signup sent for user_id: ${uid}`); // Verifica en la consola

};

export const trackUserSignUp = (uid: string) => {
  logEvent(firebaseAnalytics, 'user_signup', { user_id: uid });
  console.log(`Event user_signup sent for user_id: ${uid}`); // Verifica en la consola
};


export const trackProjectCreation = (projectId: string, userId: string) => {
  logEvent(firebaseAnalytics, 'project_created', { 
    project_id: projectId,
    user_id: userId
  });
  console.log(`Event user_signup sent for user_id: ${projectId}`); // Verifica en la consola

};

export const trackPageView = (page: string) => {
  logEvent(firebaseAnalytics, 'page_view', { 
    page_title: page 
  });
  console.log(`Event page_view sent for page: ${page}`);
};