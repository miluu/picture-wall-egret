/**
 * @namespace refManager 引用管理模块
 * @author HuangYaxiong <hyxiong@qq.com>
 */

namespace refManager {

  /**
   * @interface 纹理引用
   */
  export interface ITextureRef {
    texture: egret.Texture;
    count: number;
  }

  /**
   * @class 纹理管理类
   */
  export class TextureManager {
    /**
     * @static {ITextureRef[]}
     */
    static textureRefs: ITextureRef[] = [];

    /**
     * @static 增加纹理的引用
     * @param {egret.Texture} texture - 纹理对象
     * @param {number} [count = 1] - 增加引用的数量
     * @returns {number} - 执行操作后的该纹理的引用总数
     */
    static addRef(texture: egret.Texture, count: number = 1): number {
      if (!texture) {
        return -1;
      }
      let textureRef: ITextureRef = _.find(TextureManager.textureRefs, {texture});
      if (!textureRef) {
        textureRef = {
          texture,
          count: 0
        };
        TextureManager.textureRefs.push(textureRef);
      }
      textureRef.count += count;
      return textureRef.count;
    }

    /**
     * @static 减少纹理的引用，如纹理的引用为 0，则释放该纹理
     * @param {egret.Texture} texture - 纹理对象
     * @param {number} [count = 1] - 减少引用的数量
     * @returns {number} - 执行操作后的该纹理的引用总数
     */
    static removeRef(texture: egret.Texture, count: number = 1): number {
      if (!texture) {
        return -1;
      }
      let textureRef: ITextureRef = _.find(TextureManager.textureRefs, {texture});
      let retCount = 0;
      if (textureRef) {
        textureRef.count -= count;
        if (textureRef.count < 0) {
          textureRef.count = 0;
        }
        retCount = textureRef.count;
      }
      if (!retCount) {
        texture.dispose();
        if (textureRef) {
          _.remove(TextureManager.textureRefs, textureRef);
        }
      }
      return retCount;
    }
  }
};
