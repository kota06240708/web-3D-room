import * as THREE from 'three';

class Control {
  private _el: HTMLCanvasElement;
  private _camera: THREE.PerspectiveCamera;

  private _cameraPosY: number;
  private _isMouseDown: boolean;

  private _isMove: boolean;
  private _isSlide: boolean;
  private _isPan: boolean;

  private _mouseX: number;
  private _mouseY: number;
  private _oldX: number;
  private _oldY: number;

  private q: THREE.Quaternion;
  private axisX: THREE.Vector3;
  private axisY: THREE.Vector3;
  private _angleX: number;
  private _angleY: number;

  private _moveSpeed: number;
  private _moveSpeedForTouch: number;
  private _rotSpeed: number;

  // パン角度制限
  private _upperAngleX: number;
  private _lowerAngleX: number;

  // 移動用
  private _speedY: number;
  private _speedX: number;
  private _rotAngle: number;
  private _upAngle: number;

  // wheel
  private _wheelSpeed: number;
  private _pastWheelSpeed: number;
  private _wheelReverse: boolean;
  private _wheelEnabled: boolean;

  // 衝突判定用
  private _hitMargin: number;
  private _hitteHeightOfset: number;
  private _frontMoveEnabled: boolean;
  private _backMoveEnabled: boolean;
  private _leftMoveEnabled: boolean;
  private _rightMoveEnabled: boolean;

  // １つ前のカメラの位置
  private _cameraOldZ: number;
  private _cameraOldX: number;

  constructor() {
    this._angleX = 0;
    this._angleY = 0;

    // パン角度制限
    this._upperAngleX = 0;
    this._lowerAngleX = 0;

    this._speedY = 0;
    this._speedX = 0;
    this._rotAngle = 0;
    this._upAngle = 0;
    this._moveSpeed = 1;

    // wheel
    this._wheelSpeed = 0;
    this._pastWheelSpeed = 0;
    this._wheelReverse = false;
    this._wheelEnabled = false;

    // 衝突判定用
    this._hitMargin = 0.5;
    this._hitteHeightOfset = 0;
    this._frontMoveEnabled = true;
    this._backMoveEnabled = true;
    this._leftMoveEnabled = true;
    this._rightMoveEnabled = true;

    this._cameraOldZ = 0;
    this._cameraOldX = 0;

    // bind
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  // =======================================================
  // set、get
  // =======================================================

  /**
   * canvasをセット
   */
  set setEl(el: HTMLCanvasElement) {
    this._el = el;
  }

  /**
   * canvasを返す
   */
  get el(): HTMLCanvasElement {
    return this._el;
  }

  /**
   * カメラをセット
   */
  set setCamera(c: THREE.PerspectiveCamera) {
    this._camera = c;
  }

  /**
   * カメラを取得
   */
  get camera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  /**
   * 移動スピードをセット
   */
  set setMoveSpeed(speed: number) {
    this._moveSpeed = speed;
  }

  /**
   * 移動スピードを取得
   */
  get moveSpeed(): number {
    return this._moveSpeed;
  }

  set setAngleY(angle: number) {
    this._angleY = angle;
  }

  get angleY(): number {
    return this._angleY;
  }

  set setAngleX(angle: number) {
    this._angleX = angle;
  }

  get angleX(): number {
    return this._angleX;
  }

  set setMoveSpeedForTouch(speed: number) {
    this._moveSpeedForTouch = speed;
  }

  get moveSpeedForTouch(): number {
    return this._moveSpeedForTouch;
  }

  set setRotSpeed(speed: number) {
    this._rotSpeed = speed;
  }

  get rotSpeed(): number {
    return this._rotSpeed;
  }

  set setHitMargin(val: number) {
    this._hitMargin = val;
  }

  get hitMargin(): number {
    return this._hitMargin;
  }

  set setHitteHeightOfset(val: number) {
    this._hitteHeightOfset = val;
  }

  get hitteHeightOfset(): number {
    return this._hitteHeightOfset;
  }

  set setWheelReverse(bool: boolean) {
    this._wheelReverse = bool;
  }

  // =======================================================
  // グローバル関数
  // =======================================================

  protected update(target: any, hitTarget: any): void {
    // 移動
    if (this._isMove) {
      this._speedY = this._speedY * 1.01;
      this.move(this._speedY, target, hitTarget);

      this.checkWheel();
    }
    if (this._isSlide) {
      this._speedX = this._speedX * 1.01;
      this.slide(this._speedX, target, hitTarget);
    }

    // パン
    if (this._isPan) {
      this._rotAngle = this._rotAngle * 1.01;
      this.setQuaternion(this._upAngle, this._rotAngle);
    }
  }

  protected onEvent(): void {
    const el = this._el as HTMLElement;

    // タッチイベント判定
    if ('ontouchstart' in el) {
      // タッチ対応（スマホ・タブレット）
      el.addEventListener('touchstart', this.onTouchStart);
      el.addEventListener('touchend', this.onTouchEnd);
    } // タッチ非対応（PC）
    else {
      // keybord
      if (document.addEventListener) {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
      } // アタッチイベントに対応している
      else if (el) {
        document.attachEvent('onkeydown', this.onKeyDown);
        document.attachEvent('onkeyup', this.onKeyUp);
      }

      // mouse
      if (el.addEventListener) {
        el.addEventListener('mousedown', this.onMouseDown);
        el.addEventListener('mouseup', this.onMouseUp);
        el.addEventListener('mousewheel', this.onMouseWheel);
        el.addEventListener('mouseout', this.onMouseOut);
      } else if (el.attachEvent) {
        el.attachEvent('onmousedown', this.onMouseDown);
        el.attachEvent('onmouseup', this.onMouseUp);
        el.attachEvent('onmousewheel', this.onMouseWheel);
        el.addEventListener('onmouseout', this.onMouseOut);
      }
    }
  }

  // =======================================================
  // タッチ制御メソッド
  // =======================================================

  private onTouchStart(e: any): void {
    this._mouseX = this._oldX = e.changedTouches[0].pageX;
    this._mouseY = this._oldY = e.changedTouches[0].pageY;

    this._el.addEventListener('touchmove', this.onToucMove);
  }

  private onTouchEnd(): void {
    this._el.removeEventListener('touchmove', this.onToucMove);

    this._isMove = false;
    this._isSlide = false;
    this._isPan = false;
  }

  private onToucMove(e: any): void {
    e.preventDefault();
    this._isMove = true;

    let dx = 0;
    let dy = 0;

    this._mouseX = e.changedTouches[0].pageX;
    this._mouseY = e.changedTouches[0].pageY;
    dx = this._mouseX - this._oldX;
    dy = this._mouseY - this._oldY;

    const angleX = -(dy * 0.1) * this._rotSpeed * 0.6;
    const angleY = -(dx * 0.1) * this._rotSpeed * 0.6;
    this._speedY = -(dy * 0.004) * this._moveSpeed;

    this.setQuaternion(angleX, angleY);

    this._oldX = this._mouseX;
    this._oldY = this._mouseY;
  }

  // =======================================================
  // キーボード制御メソッド
  // =======================================================

  private onKeyDown(e: any): void {
    // キーコード
    const keycode = e.keyCode;
    //console.log("code:" + keycode);

    e.preventDefault();

    // 移動
    if (!this._isMove) {
      if (keycode == 38) {
        // up
        this._isMove = true;
        this._speedY = 0.02 * this._moveSpeed;
      }
      if (keycode == 40) {
        // down
        this._isMove = true;
        this._speedY = -0.02 * this._moveSpeed;
      }
    }
    if (!this._isSlide) {
      if (keycode == 39) {
        // right
        this._isSlide = true;
        this._speedX = -0.02 * this._moveSpeed;
      }
      if (keycode == 37) {
        // left
        this._isSlide = true;
        this._speedX = 0.02 * this._moveSpeed;
      }
    }

    // 回転
    if (!this._isPan) {
      if (keycode == 68) {
        // A
        this._isPan = true;
        this._upAngle = 0;
        this._rotAngle = -0.25 * this._rotSpeed;
      }
      if (keycode == 65) {
        // D
        this._isPan = true;
        this._upAngle = 0;
        this._rotAngle = 0.25 * this._rotSpeed;
      }
      if (keycode == 83) {
        // W
        this._isPan = true;
        this._upAngle = -0.25 * this._rotSpeed;
        this._rotAngle = 0;
      }
      if (keycode == 87) {
        // S
        this._isPan = true;
        this._upAngle = 0.25 * this._rotSpeed;
        this._rotAngle = 0;
      }
    }
  }

  private onKeyUp() {
    this._isMove = false;
    this._isSlide = false;
    this._isPan = false;
  }

  // =======================================================
  // マウス制御メソッド
  // =======================================================

  private onMouseDown(e: any): void {
    e.preventDefault();
    this._mouseX = this._oldX = e.clientX;
    this._mouseY = this._oldY = e.clientY;
    document.addEventListener('mousemove', this.onMouseMove);
  }

  private onMouseUp(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    this._isMove = false;
    this._isSlide = false;
    this._isPan = false;
  }

  private onMouseOut(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    this._isMove = false;
    this._isSlide = false;
    this._isPan = false;
  }

  private onMouseMove(e: any): void {
    this._isMove = true;

    this._mouseX = e.clientX;
    this._mouseY = e.clientY;

    const dx = this._mouseX - this._oldX;
    const dy = this._mouseY - this._oldY;

    const angleX = -(dy * 0.025) * this._rotSpeed;
    const angleY = -(dx * 0.025) * this._rotSpeed;
    this._speedY = -(dy * 0.005) * this._moveSpeed;

    // rotate
    this.setQuaternion(angleX, angleY);

    this._oldX = this._mouseX;
    this._oldY = this._mouseY;
  }

  private onMouseWheel(e: any): void {
    e.preventDefault();

    this._wheelEnabled = true;
    this._wheelSpeed = e.wheelDelta;

    this._speedY = -(this._wheelSpeed * 0.0001) * this._moveSpeed;

    // ホイール逆回転
    if (this._wheelReverse) {
      this._speedY *= -1;
    }

    // 移動
    if (this._speedY > 10) {
      this._speedY = 10;
    }
    if (this._speedY < -10) {
      this._speedY = -10;
    }
    this._isMove = true;

    this._pastWheelSpeed = this._wheelSpeed;
  }

  private checkWheel(): void {
    if (this._wheelEnabled && this._pastWheelSpeed === this._wheelSpeed) {
      this._isMove = this._wheelEnabled = false;
    }
  }

  // =======================================================
  // カメラ制御メソッド
  // =======================================================

  /**
   * カメラ上下左右パン
   * @param angX
   * @param angY
   */
  protected setQuaternion(angX: number, angY: number): void {
    this._angleX += this.angleToRag(angX);
    if (this._angleX < this.angleToRag(this._lowerAngleX)) {
      this._angleX = this.angleToRag(this._lowerAngleX);
    }

    if (this._angleX > this.angleToRag(this._upperAngleX)) {
      this._angleX = this.angleToRag(this._upperAngleX);
    }

    const q1 = new THREE.Quaternion();
    q1.setFromAxisAngle(this.axisX, this._angleX);

    this._angleY += this.angleToRag(angY);
    const q2 = new THREE.Quaternion();
    q2.setFromAxisAngle(this.axisY, this._angleY);

    this.q.multiplyQuaternions(q2, q1);

    this._camera.quaternion.copy(this.q);
  }

  /**
   * 前後の移動
   * @param speed
   * @param target
   * @param hitTarget
   */
  private move(speed: number, target: any, hitTarget: any): void {
    const axis = new THREE.Vector3(0, 0, 1);
    this._camera.translateOnAxis(axis, -speed);

    const s = this.abs(speed * 0.1); //Math.abs(speed * .1);

    this.limitter(s);
    this.hitTest(target, hitTarget, s);
  }

  /**
   * 左右の移動
   *
   * @param speed
   * @param target
   * @param hitTarget
   */

  private slide(speed: number, target: any, hitTarget: any): void {
    this._camera.translateOnAxis(this.axisX, -speed);

    const s = this.abs(speed * 0.1); //Math.abs(speed * .1);

    this.limitter(s);
    this.hitTest(target, hitTarget, s);
  }

  /**
   * リミッター
   * @param margin
   */
  private limitter(margin: number): void {
    if (!this._frontMoveEnabled) {
      this._camera.position.z = this._cameraOldZ + margin;
    }

    if (!this._backMoveEnabled) {
      this._camera.position.z = this._cameraOldZ - margin;
    }

    if (!this._leftMoveEnabled) {
      this._camera.position.x = this._cameraOldX + margin;
    }

    if (!this._rightMoveEnabled) {
      this._camera.position.x = this._cameraOldX - margin;
    }

    this._cameraOldZ = this._camera.position.z;
    this._cameraOldX = this._camera.position.x;
  }

  /**
   * カメラへのあたり判定
   * @param target
   * @param hitTarget
   * @param speed
   */
  private hitTest(target: any, hitTarget: any, speed: number): void {
    // 下方向アタリ判定
    const dirY = new THREE.Vector3(0, -1, 0);
    const rayY = new THREE.Raycaster(this._camera.position, dirY);
    const objsY = rayY.intersectObjects(target);

    if (objsY.length > 0) {
      //	console.log("col_under");
      const dist = objsY[0].distance;
      let ofset = 0;
      if (dist >= 0) {
        ofset = dist - this._cameraPosY;
      } else {
        ofset = -this._cameraPosY - dist;
      }
      //
      if (this._camera.position.y >= this._cameraPosY) {
        this._camera.position.y -= ofset;
      } else {
        this._camera.position.y = this._cameraPosY;
      }
    }

    const hitter = new THREE.Vector3(
      this._camera.position.x,
      this._camera.position.y + this._hitteHeightOfset,
      this._camera.position.z
    );

    // 前方向アタリ判定
    const dirZF = new THREE.Vector3(0, 0, -1);
    const rayZF = new THREE.Raycaster(hitter, dirZF);
    const objsZF = rayZF.intersectObjects(hitTarget);
    if (objsZF.length > 0) {
      console.log('F:', objsZF[0].distance);
      if (objsZF[0].distance < this._hitMargin + speed) {
        this._frontMoveEnabled = false;
      } else {
        this._frontMoveEnabled = true;
      }
    }

    // 後方向アタリ判定
    const dirZD = new THREE.Vector3(0, 0, 1);
    const rayZD = new THREE.Raycaster(hitter, dirZD);
    const objsZD = rayZD.intersectObjects(hitTarget);
    if (objsZD.length > 0) {
      console.log('B:', objsZD[0]);
      if (objsZD[0].distance < this._hitMargin + speed) {
        this._backMoveEnabled = false;
      } else {
        this._backMoveEnabled = true;
      }
    }

    // 左方向アタリ判定
    const dirXL = new THREE.Vector3(-1, 0, 0);
    const rayXL = new THREE.Raycaster(hitter, dirXL);
    const objsXL = rayXL.intersectObjects(hitTarget);
    if (objsXL.length > 0) {
      console.log('L:', objsXL[0].distance);
      if (objsXL[0].distance < this._hitMargin + speed) {
        this._leftMoveEnabled = false;
      } else {
        this._leftMoveEnabled = true;
      }
    }

    // 右方向アタリ判定
    const dirXR = new THREE.Vector3(1, 0, 0);
    const rayXR = new THREE.Raycaster(hitter, dirXR);
    const objsXR = rayXR.intersectObjects(hitTarget);
    if (objsXR.length > 0) {
      console.log('R:', objsXR[0].distance);
      if (objsXR[0].distance < this._hitMargin + speed) {
        this._rightMoveEnabled = false;
      } else {
        this._rightMoveEnabled = true;
      }
    }
  }

  // =======================================================
  // 補助関数
  // =======================================================

  /**
   * angle to rag（角度 >> ラジアン）
   * @param angle 角度
   */
  private angleToRag(angle: number): number {
    const rag = angle * (Math.PI / 180);
    return rag;
  }

  private abs(a: number): number {
    return a > 0 ? a : -a;
  }
}

export default Control;
