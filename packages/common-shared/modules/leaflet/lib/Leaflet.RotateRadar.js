import * as L from 'leaflet'

export default function (deviceObj, options) {
  /**Renderer */
  var Renderer = L.Canvas.extend({
    options: {
      /**
       * Collision detection
       */
      collisionFlg: true,
    },
    initialize: function (options) {
      options = L.Util.setOptions(this, options)
      //add
      L.Util.stamp(this)
      this._layers = this._layers || {}
    },
    _handleMouseHover: function (e, point) {
      var id, layer
      for (id in this._drawnLayers) {
        layer = this._drawnLayers[id]
        if (layer.options.interactive && layer._containsPoint(point)) {
          L.DomUtil.addClass(this._containerText, 'leaflet-interactive') // change cursor
          this._fireEvent([layer], e, 'mouseover')
          this._hoveredLayer = layer
        }
      }
      if (this._hoveredLayer) {
        this._fireEvent([this._hoveredLayer], e)
      }
    },
    _handleMouseOut: function (e, point) {
      var layer = this._hoveredLayer
      if (layer && (e.type === 'mouseout' || !layer._containsPoint(point))) {
        // if we're leaving the layer, fire mouseout
        L.DomUtil.removeClass(this._containerText, 'leaflet-interactive')
        this._fireEvent([layer], e, 'mouseout')
        this._hoveredLayer = null
      }
    },
    _updateTransform: function (center, zoom) {
      L.Canvas.prototype._updateTransform.call(this, center, zoom)
      var scale = this._map.getZoomScale(zoom, this._zoom),
        position = L.DomUtil.getPosition(this._container),
        viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
        currentCenterPoint = this._map.project(this._center, zoom),
        destCenterPoint = this._map.project(center, zoom),
        centerOffset = destCenterPoint.subtract(currentCenterPoint),
        topLeftOffset = viewHalf
          .multiplyBy(-scale)
          .add(position)
          .add(viewHalf)
          .subtract(centerOffset)

      if (L.Browser.any3d) {
        L.DomUtil.setTransform(this._containerText, topLeftOffset, scale)
      } else {
        L.DomUtil.setPosition(this._containerText, topLeftOffset)
      }
    },
    _initContainer: function (options) {
      L.Canvas.prototype._initContainer.call(this)
      this._containerText = document.createElement('canvas')
      L.DomEvent.on(
        this._containerText,
        'mousemove',
        L.Util.throttle(this._onMouseMove, 32, this),
        this
      )
        .on(
          this._containerText,
          'click dblclick mousedown mouseup contextmenu',
          this._onClick,
          this
        )
        .on(this._containerText, 'mouseout', this._handleMouseOut, this)

      this._ctxLabel = this._containerText.getContext('2d')
      L.DomUtil.addClass(this._containerText, 'leaflet-zoom-animated')
      this.getPane().appendChild(this._containerText)
    },

    _update: function () {
      // textList
      this._textList = []
      L.Renderer.prototype._update.call(this)
      var b = this._bounds,
        container = this._containerText,
        size = b.getSize(),
        m = L.Browser.retina ? 2 : 1
      L.DomUtil.setPosition(container, b.min)
      // set canvas size (also clearing it); use double size on retina
      container.width = m * size.x
      container.height = m * size.y
      container.style.width = size.x + 'px'
      container.style.height = size.y + 'px'
      // display text on the whole surface
      container.style.zIndex = '4'
      this._container.style.zIndex = '3'
      if (L.Browser.retina) {
        this._ctxLabel.scale(2, 2)
      }
      // translate so we use the same path coordinates after canvas
      // element moves
      this._ctxLabel.translate(-b.min.x, -b.min.y)
      L.Canvas.prototype._update.call(this)
    },

    _updatePoly: function (layer, closed) {
      L.Canvas.prototype._updatePoly.call(this, layer, closed)
      this._text(this._ctxLabel, layer)
    },

    _updateCircle: function (layer) {
      L.Canvas.prototype._updateCircle.call(this, layer)
      this._text(this._ctxLabel, layer)
    },
    // 更新绘制扇形
    _updateSector: function (layer) {
      if (!this._drawing || layer._empty()) {
        return
      }
      var p = layer._point,
        ctx = this._ctx,
        r = Math.max(Math.round(layer._radius), 1), // 半径
        s = (Math.max(Math.round(layer._radiusY), 1) || r) / r

      if (s !== 1) {
        ctx.save()
        ctx.scale(1, s)
      }

      // 创建多个扇形模拟
      // let angle = Math.abs(layer._startAngle - layer._endAngle)
      // if (angle > 180) angle = angle - 180
      // const gradientDeg = 7 // 每过多少度生成一个渐变扇形，越小越精细，但越卡
      // const blob = Math.round(angle / gradientDeg)
      // const maxOpacity = 80 // 最大透明度，最高100,即不透明
      // const avg = maxOpacity / angle
      // const startAngle = layer._startAngle
      // new Array(blob).fill(null).forEach((i, index) => {
      //   const opacity = Math.ceil(maxOpacity - avg * index * gradientDeg) / 100
      //   const color = `rgba(61, 126, 255, ${opacity})`
      //   ctx.fillStyle = color
      //   ctx.beginPath()
      //   ctx.moveTo(p.x, p.y / s)
      //   ctx.arc(
      //     p.x,
      //     p.y / s,
      //     r,
      //     ((startAngle - index * gradientDeg) / 180) * Math.PI,
      //     ((startAngle - index * gradientDeg + gradientDeg) / 180) * Math.PI,
      //     false
      //   )
      //   ctx.closePath()
      //   ctx.fill()
      // })

      // 计算渐变的起点和终点
      const startX = p.x + r * Math.cos(layer._startAngle * (Math.PI / 180))
      const startY = p.y + r * Math.sin(layer._startAngle * (Math.PI / 180))
      const endX = p.x + r * Math.cos(layer._endAngle * (Math.PI / 180))
      const endY = p.y + r * Math.sin(layer._endAngle * (Math.PI / 180))

      // 创建线性渐变
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
      gradient.addColorStop(0, 'rgba(61, 126, 255, 0)') // 开始边透明
      gradient.addColorStop(0.5, 'rgba(61, 126, 255, 0.02)') // 中间接近透明
      gradient.addColorStop(1, 'rgba(61, 126, 255, 0.9)') // 结束边绿色半透明

      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.arc(
        p.x,
        p.y,
        r,
        layer._startAngle * (Math.PI / 180),
        layer._endAngle * (Math.PI / 180),
        false
      )
      ctx.lineTo(p.x, p.y)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.save()
    },

    _text: function (ctx, layer) {
      if (layer.options.text != undefined && this._map.getZoom() > 14) {
        ctx.globalAlpha = 1

        var p = layer._point
        var textPoint

        if (p == undefined) {
          // polygon or polyline
          if (layer._parts.length == 0 || layer._parts[0].length == 0) {
            return
          }
          p = this._getCenter(layer._parts[0])
        }

        // label bounds offset
        var offsetX = 7
        var offsetY = 5

        /**
         * TODO setting for custom font
         */
        ctx.lineWidth = 4.0
        ctx.font = "12px 'Meiryo'"

        // Collision detection
        var textWidth = ctx.measureText(layer.options.text).width + p.x // + offsetX;

        var textHeight = p.y + offsetY + 20

        var bounds = L.bounds(L.point(p.x + offsetX, p.y + offsetY), L.point(textWidth, textHeight))

        if (this.options.collisionFlg) {
          for (var index in this._textList) {
            var pointBounds = this._textList[index]
            if (pointBounds.intersects(bounds)) {
              return
            }
          }
        }
        this._textList.push(bounds)
        // ctx.strokeStyle = "white";
        // ctx.strokeText(layer.options.text, p.x + offsetX, p.y
        //         + offsetY);
        this._drawBubble(ctx, p.x, p.y, ctx.measureText(layer.options.text).width + 10, 20)
        if (layer.options.textColor == undefined) {
          ctx.fillStyle = 'blue'
        } else {
          ctx.fillStyle = layer.options.textColor
        }

        ctx.fillText(layer.options.text, p.x + offsetX, p.y + offsetY)
      }
    },
    _drawBubble: function (ctx, x, y, w, h) {
      //左上角点(x,y) 整体宽高(w,h)
      ctx.fillStyle = 'rgba(212,212,212,.8)'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 3, y + 3)
      ctx.lineTo(x + 3, y + h / 2)
      ctx.lineTo(x + w, y + h / 2)
      ctx.lineTo(x + w, y - h / 2)
      ctx.lineTo(x + 3, y - h / 2)
      ctx.lineTo(x + 3, y)
      ctx.fill()
    },
    _updateDashArray: function (layer) {
      if (typeof layer.options.dashArray === 'string') {
        var parts = layer.options.dashArray.split(/[, ]+/),
          dashArray = [],
          dashValue,
          i
        for (i = 0; i < parts.length; i++) {
          dashValue = Number(parts[i])
          // Ignore dash array containing invalid lengths
          if (isNaN(dashValue)) {
            return
          }
          dashArray.push(dashValue)
        }
        layer.options._dashArray = dashArray
        layer.options._dashOffset = layer.options.dashOffset
      } else {
        layer.options._dashArray = layer.options.dashArray
        layer.options._dashOffset = layer.options.dashOffset || 0
      }
    },
    _fillStroke: function (ctx, layer) {
      var options = layer.options

      if (options.fill) {
        ctx.globalAlpha = options.fillOpacity

        ctx.fillStyle = options.fillColor || options.color
        ctx.fill(options.fillRule || 'evenodd')
      }

      if (options.stroke && options.weight !== 0) {
        if (ctx.setLineDash) {
          ctx.setLineDash((layer.options && layer.options._dashArray) || [])
          ctx.lineDashOffset = (layer.options && layer.options._dashOffset) || 0
        }
        ctx.globalAlpha = options.opacity
        ctx.lineWidth = options.weight
        ctx.strokeStyle = options.color
        ctx.lineCap = options.lineCap
        ctx.lineJoin = options.lineJoin
        ctx.stroke()
      }
    },
    _getCenter: function (points) {
      var i,
        halfDist,
        segDist,
        dist,
        p1,
        p2,
        ratio,
        len = points.length
      if (!len) {
        return null
      }
      // polyline centroid algorithm; only uses the first ring if
      // there are multiple
      for (i = 0, halfDist = 0; i < len - 1; i++) {
        halfDist += points[i].distanceTo(points[i + 1]) / 2
      }

      // The line is so small in the current view that all points are
      // on the same pixel.
      if (halfDist === 0) {
        return points[0]
      }

      for (i = 0, dist = 0; i < len - 1; i++) {
        p1 = points[i]
        p2 = points[i + 1]
        segDist = p1.distanceTo(p2)
        dist += segDist

        if (dist > halfDist) {
          ratio = (dist - halfDist) / segDist
          var resutl = [p2.x - ratio * (p2.x - p1.x), p2.y - ratio * (p2.y - p1.y)]

          return L.point(resutl[0], resutl[1])
        }
      }
    },
  })
  /**定义扇形 */
  var Sector = L.Circle.extend({
    options: {
      renderer: new Renderer(),
    },
    // options - 起点角度、终点角度和半径
    initialize: function (latlng, options, legacyOptions) {
      if (options) {
        this._startAngle = options.startAngle - 90
        this._endAngle = options.endAngle - 90
        L.Circle.prototype.initialize.call(this, latlng, options, legacyOptions)
      }
    },
    _updatePath: function () {
      if ((this._endAngle - this._startAngle) % 360 == 0) {
        this._renderer._updateCircle(this)
      } else {
        this._renderer._updateSector(this)
      }
    },
    setStyle: function (options) {
      // this._startAngle = options.startAngle - 90
      // this._endAngle = options.endAngle - 90
      L.Circle.prototype.setStyle.call(this, options)
    },
  })
  /**定义雷达图层 */
  var RotateRadar = L.LayerGroup.extend({
    options: {
      color: '#238',
      weight: 0,
      opacity: 0,
      fillColor: '#ff0',
      fillOpacity: 0.05,
      step: 1,
    },
    initialize: function (deviceObj, options) {
      L.setOptions(this, options)
      this.map = null
      this.mark = null
      this.center = null
      this.RadarArea = null
      this.deviceObj = deviceObj
      this.startR = deviceObj.direction - deviceObj.angle / 2
      this.reshArea()
      L.LayerGroup.prototype.initialize.call(this, [])
    },
    getStyle() {
      return this.options
    },
    reshArea() {
      this.initCenter()
      this._initSector() // 初始化扇形区域，即RadarArea
    },

    _initSector() {
      if (!this.animationRadarArea) {
        this.animationRadarArea = this.creatSector(this.getStyle())
      } else {
        var style = this.getSectorOptions(this.getStyle())
        this.animationRadarArea.setStyle(style)
        this.animationRadarArea.setLatLng(L.latLng(this.center))
      }
    },
    creatSector(opstyle) {
      if (this.center) {
        var style = this.getSectorOptions(opstyle)
        if (style) {
          return new Sector(this.center, style)
        }
      } else {
        return false
      }
    },
    _motion: function () {
      var self = this
      var step = this.options.step
      if (!step) return // 不设置step或者step === 0则停止动画

      self.startR += step
      self.endAngle = self.startR + self.deviceObj.angle
      if (self.startR >= 360) {
        self.startR -= 360
        self.endAngle -= 360
      }
      self.animationRadarArea._startAngle = self.startR
      self.animationRadarArea._endAngle = self.endAngle
      // self.RadarArea._updatePath()
      self.animationRadarArea.setRadius(self.deviceObj.radius)
      // self.animationRadarArea2.setRadius(currentR)

      self.animation = L.Util.requestAnimFrame(() => {
        self._motion()
      }, self)
      //self.toggleRadarAnimate(false)
      // self.animation = null
    },
    // 获取扇形的起点角度、终点角度和半径
    getSectorOptions(style) {
      if (this.deviceObj.angle == 0) {
        return null
      }
      //通用版本这么算 - 即方向为扇形的中心线
      var startAngle = this.deviceObj.direction - this.deviceObj.angle / 2
      var endAngle = this.deviceObj.direction + this.deviceObj.angle / 2
      if (!style) {
        style = this.getStyle()
      }
      var radius = this.deviceObj.radius
      style = Object.assign(style, {
        startAngle: startAngle,
        endAngle: endAngle,
        radius: radius,
      })
      return style
    },
    initCenter() {
      if (this.deviceObj.location) {
        var latlngstr = this.deviceObj.location.split(' ')
        if (
          parseFloat(latlngstr[0]) >= 0 &&
          parseFloat(latlngstr[0]) <= 90 &&
          parseFloat(latlngstr[1]) >= 0 &&
          parseFloat(latlngstr[1]) <= 180
        ) {
          this.center = [parseFloat(latlngstr[0]), parseFloat(latlngstr[1])]
        } else {
          this.center = null
          console.error('坐标错误')
          return
        }
      }
    },
    update: function (updevice) {
      if (this.deviceObj && updevice) {
        this.deviceObj.radius = updevice.radius
        this.deviceObj.angle = updevice.angle
        this.deviceObj.direction = updevice.direction
        if (updevice.location) {
          this.deviceObj.location = updevice.location
        }
      }
      this.reshArea()
    },
    adjust: function (location) {
      if (location) {
        this.deviceObj.location = location
        this.reshArea()
      }
    },
    move: function (center) {
      var latlngstr = this.deviceObj.location.split(' ')
      var Oldcenter = [parseFloat(latlngstr[0]), parseFloat(latlngstr[1])]
      Oldcenter[0] += center[0]
      Oldcenter[1] += center[1]
      this.deviceObj.location = Oldcenter.join(' ')
      this.reshArea()
    },
    toggleRadarAnimate: function (visible) {
      if (this.RadarArea) {
        if (visible) {
          if (!this.map.hasLayer(this.animationRadarArea)) {
            L.LayerGroup.prototype.addLayer.call(this, this.animationRadarArea)
            // L.LayerGroup.prototype.addLayer.call(this, this.animationRadarArea2)
          }
        } else {
          L.LayerGroup.prototype.removeLayer.call(this, this.animationRadarArea)
          // L.LayerGroup.prototype.removeLayer.call(this, this.animationRadarArea2)
        }
      }
    },
    toggleRadarArea: function (visible) {
      if (visible) {
        if (!this.map.hasLayer(this.RadarArea)) {
          if (this.RadarArea) {
            L.LayerGroup.prototype.addLayer.call(this, this.RadarArea)
          }
          L.LayerGroup.prototype.addLayer.call(this, this.mark)
        }
      } else {
        L.LayerGroup.prototype.removeLayer.call(this, this.RadarArea)
        L.LayerGroup.prototype.addLayer.call(this, this.mark)
      }
    },
    getConfg() {
      return this.deviceObj
    },
    onAdd: function (map) {
      this.map = map

      if (this.RadarArea) {
        L.LayerGroup.prototype.addLayer.call(this, this.RadarArea)
      }

      if (this.mark) {
        L.LayerGroup.prototype.addLayer.call(this, this.mark)
      }
      this._motion()
      if (this.animationRadarArea) {
        L.LayerGroup.prototype.addLayer.call(this, this.animationRadarArea)
      }
    },
    onRemove: function () {
      this.interval && clearInterval(this.interval)
    },
  })

  return new RotateRadar(deviceObj, options)
}
