export const reste = ({commit},play) => {
  commit({
    type: 'reste',     //对应mutation.js中的mutationsMsg方法
    headerImgUrl: play.headerImgUrl
  });
};
