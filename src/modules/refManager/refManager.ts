/**
 * @namespace refManager 引用管理模块
 * @author HuangYaxiong <hyxiong@qq.com>
 */

declare class WeakMap<K, V> {
  set(k: K, v: V): WeakMap<K, V>;
  get(k: K): V;
  delete(k: K): boolean;
}

namespace refManager {

  /**
   * @class 纹理管理类
   */
  export class TextureManager {
    /**
     * @static {ITextureRef[]}
     */
    static textureRefs: WeakMap<egret.Texture, number> = new WeakMap<egret.Texture, number>();

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
      let refCount = TextureManager.textureRefs.get(texture) || 0;
      refCount += count;
      TextureManager.textureRefs.set(texture, count);
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
      let refCount = TextureManager.textureRefs.get(texture) || 0;
      refCount -= count;
      if (refCount <= 0) {
        texture.dispose();
        TextureManager.textureRefs.delete(texture);
      } else {
        TextureManager.textureRefs.set(texture, refCount);
      }
    }
  }
};
