<template>
  <div class="container mt-4">
    <h1 class="fw-bolder text-dark mb-4">Community Map</h1>
    <p class="text-dark fs-5 fw-bold mb-4">
      Find local support services, plan a trip, or look up any address — powered by
      OpenStreetMap.
    </p>

    <!-- 操作失败或加载失败的提示 -->
    <div
      v-if="errorMessage !== ''"
      class="alert alert-danger fs-5 fw-bold p-3 shadow-sm border-2 rounded-4"
      role="alert"
    >
      {{ errorMessage }}
    </div>

    <div class="row g-4">
      <!-- 左侧：三个功能的输入区 + 文字结果列表 -->
      <div class="col-md-4">
        <!-- 功能一：地点搜索（Photon / OpenStreetMap） -->
        <div class="card shadow border-2 border-primary rounded-4 mb-4">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-3">Search Places</h2>
            <div class="input-group input-group-lg shadow-sm">
              <input
                type="text"
                v-model="placeQuery"
                class="form-control border-2"
                placeholder="e.g., aged care Melbourne"
                v-on:keyup.enter="searchPlaces"
                aria-label="Search for places"
              />
              <button
                type="button"
                v-on:click="searchPlaces"
                class="btn btn-primary fw-bold"
              >
                Search
              </button>
            </div>

            <!-- 搜索结果文字列表（给屏幕阅读器用的地图替代方案） -->
            <ul v-if="placeResults.length > 0" class="list-group mt-3">
              <li
                v-for="(place, index) in placeResults"
                v-bind:key="index"
                class="list-group-item fs-6 fw-bold p-2"
              >
                <button
                  type="button"
                  class="btn btn-link p-0 text-start text-decoration-none"
                  v-on:click="focusPlace(place)"
                >
                  {{ getPlaceName(place) }}
                  <span class="text-secondary fw-bold ms-1">{{ getPlaceVicinity(place) }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- 功能二：路线规划（OSRM / OpenStreetMap） -->
        <div class="card shadow border-2 border-success rounded-4 mb-4">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-3">Get Directions</h2>
            <div class="mb-3">
              <label class="form-label text-dark fw-bold fs-5" for="mapOrigin">Start</label>
              <input
                id="mapOrigin"
                type="text"
                v-model="originQuery"
                class="form-control form-control-lg border-2"
                placeholder="e.g., Melbourne CBD"
              />
            </div>
            <div class="mb-3">
              <label class="form-label text-dark fw-bold fs-5" for="mapDestination"
                >Destination</label
              >
              <input
                id="mapDestination"
                type="text"
                v-model="destinationQuery"
                class="form-control form-control-lg border-2"
                placeholder="e.g., Box Hill"
              />
            </div>
            <button
              type="button"
              v-on:click="calculateRoute"
              class="btn btn-success btn-lg w-100 fw-bold shadow-sm"
            >
              Plan Route
            </button>
            <div
              v-if="routeSummary !== ''"
              class="alert alert-success fs-6 fw-bold mt-3 mb-0 p-2"
              role="status"
            >
              {{ routeSummary }}
            </div>
            <!-- 路线分步文字（无障碍：屏幕阅读器可逐段朗读） -->
            <ol
              v-if="routeSteps.length > 0"
              class="list-group list-group-numbered mt-3 text-start"
            >
              <li
                v-for="(step, index) in routeSteps"
                v-bind:key="index"
                class="list-group-item fs-6 fw-bold p-2"
              >
                {{ step }}
              </li>
            </ol>
          </div>
        </div>

        <!-- 功能三：地址查找（正地理编码） -->
        <div class="card shadow border-2 border-info rounded-4">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-3">Find an Address</h2>
            <div class="input-group input-group-lg shadow-sm">
              <input
                type="text"
                v-model="addressQuery"
                class="form-control border-2"
                placeholder="e.g., 271 Collins St Melbourne"
                v-on:keyup.enter="geocodeAddress"
                aria-label="Find an address on the map"
              />
              <button
                type="button"
                v-on:click="geocodeAddress"
                class="btn btn-info text-dark fw-bold"
              >
                Locate
              </button>
            </div>
            <p class="text-dark fs-6 fw-bold mt-3 mb-0">
              Tip: click anywhere on the map to see its address (reverse geocoding).
            </p>
          </div>
        </div>
      </div>

      <!-- 右侧：地图 -->
      <div class="col-md-8">
        <div
          ref="mapContainer"
          class="map-box rounded-4 border border-2 shadow-sm"
          aria-label="Interactive map showing searched places, routes and addresses"
        ></div>

        <!-- 点击地图反查到的地址 -->
        <div
          v-if="clickedAddress !== ''"
          class="alert alert-primary fs-5 fw-bold mt-3 mb-0 p-3 rounded-3"
          role="status"
        >
          <span class="badge bg-primary me-2">Clicked location</span>
          {{ clickedAddress }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Leaflet 是免费开源的地图库，配 OpenStreetMap 无需 API key 或信用卡
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 打包后默认标记图片的路径会失效，这里手动补上真实图片地址
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

export default {
  name: 'MapView',
  data() {
    return {
      map: null, // Leaflet 地图实例
      markers: [], // 地图上的标记列表
      routeLine: null, // 路线折线图层
      placeResults: [], // 地点搜索结果（用作文字列表）
      placeQuery: '', // 地点搜索关键词
      originQuery: '', // 路线起点
      destinationQuery: '', // 路线终点
      addressQuery: '', // 地址查找关键词
      clickedAddress: '', // 点击地图反查到的地址
      routeSummary: '', // 路线的距离与耗时摘要
      routeSteps: [], // 路线分步说明
      errorMessage: '', // 操作失败的提示文字
    }
  },
  mounted() {
    // 初始化地图：默认显示墨尔本市区
    this.map = L.map(this.$refs.mapContainer).setView([-37.8136, 144.9631], 12)

    // 加载 OpenStreetMap 免费切片（无需 key）
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map)

    // 点击地图 → 逆地理编码，反查该位置的地址
    this.map.on('click', (event) => {
      this.reverseGeocode(event.latlng.lat, event.latlng.lng)
    })
  },
  methods: {
    // 功能一（Places 搜索）：调用 Photon 免费接口搜索地点并在地图上标注
    async searchPlaces() {
      this.errorMessage = ''
      if (this.placeQuery === '') {
        return
      }

      try {
        const url =
          'https://photon.komoot.io/api/?q=' +
          encodeURIComponent(this.placeQuery) +
          '&limit=6'
        const response = await fetch(url)
        const data = await response.json()

        const results = data.features !== undefined ? data.features : []
        this.placeResults = results
        this.clearMarkers()

        // 为每一个结果在地图上添加标记
        for (let i = 0; i < results.length; i++) {
          const coords = results[i].geometry.coordinates // [经度, 纬度]
          this.addMarkerAt(coords[1], coords[0], this.getPlaceName(results[i]))
        }

        // 地图中心移到第一个找到的地点
        if (results.length > 0) {
          const first = results[0].geometry.coordinates
          this.map.setView([first[1], first[0]], 14)
        } else {
          this.errorMessage = 'No places found for that search.'
        }
      } catch {
        this.errorMessage = 'Place search failed. Please check your connection.'
      }
    },

    // 从 Photon 结果里取地点名称
    getPlaceName(place) {
      const name = place.properties.name
      if (name !== undefined && name !== '') {
        return name
      }
      return 'Place'
    },

    // 从 Photon 结果里拼出地点所在城市/地区，用于辅助展示
    getPlaceVicinity(place) {
      const props = place.properties
      const parts = []
      if (props.city !== undefined && props.city !== '') {
        parts.push(props.city)
      }
      if (props.state !== undefined && props.state !== '') {
        parts.push(props.state)
      }
      if (props.country !== undefined && props.country !== '') {
        parts.push(props.country)
      }
      return parts.join(', ')
    },

    // 在地图指定经纬度放置一个标记
    addMarkerAt(lat, lng, title) {
      const marker = L.marker([lat, lng]).addTo(this.map)
      if (title !== undefined && title !== '') {
        marker.bindPopup(title)
      }
      this.markers.push(marker)
    },

    // 清空地图上所有标记
    clearMarkers() {
      for (let i = 0; i < this.markers.length; i++) {
        this.map.removeLayer(this.markers[i])
      }
      this.markers = []
    },

    // 功能二（路线规划）：先把起终点地址转成坐标，再调用 OSRM 计算路线
    async calculateRoute() {
      this.errorMessage = ''
      this.routeSteps = []
      if (this.originQuery === '' || this.destinationQuery === '') {
        this.errorMessage = 'Please enter both a start and a destination.'
        return
      }

      // 1. 用 Photon 把两个地址翻译成坐标
      const origin = await this.forwardGeocode(this.originQuery)
      const destination = await this.forwardGeocode(this.destinationQuery)
      if (origin === null || destination === null) {
        this.errorMessage = 'Could not find the start or destination address.'
        return
      }

      // 2. 调用 OSRM 免费路由接口（geometries=geojson 直接返回经纬度数组）
      const url =
        'https://router.project-osrm.org/route/v1/driving/' +
        origin.lon +
        ',' +
        origin.lat +
        ';' +
        destination.lon +
        ',' +
        destination.lat +
        '?overview=full&geometries=geojson&steps=true'

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.code !== 'Ok' || data.routes.length === 0) {
          this.errorMessage = 'Could not calculate the route. Please check the two addresses.'
          return
        }

        const route = data.routes[0]

        // 把路线画到地图上（GeoJSON 坐标是 [经度, 纬度]，要调换成 Leaflet 的 [纬度, 经度]）
        const latLngs = route.geometry.coordinates.map((pair) => {
          return [pair[1], pair[0]]
        })
        if (this.routeLine !== null) {
          this.map.removeLayer(this.routeLine)
        }
        this.routeLine = L.polyline(latLngs, { color: '#0d6efd', weight: 5 }).addTo(this.map)
        this.map.fitBounds(this.routeLine.getBounds())

        // 距离与耗时的摘要
        this.routeSummary =
          'Total ' +
          (route.distance / 1000).toFixed(1) +
          ' km, about ' +
          Math.round(route.duration / 60) +
          ' minutes'

        // 收集分步说明（屏幕阅读器可读）
        const steps = route.legs[0].steps
        for (let i = 0; i < steps.length; i++) {
          const instruction = steps[i].maneuver.instruction
          const distance = (steps[i].distance / 1000).toFixed(1)
          this.routeSteps.push(instruction + ' (' + distance + ' km)')
        }
      } catch {
        this.errorMessage = 'Route planning failed. Please check your connection.'
      }
    },

    // 调用 Photon 把地址转成坐标；找不到返回 null
    async forwardGeocode(query) {
      const url = 'https://photon.komoot.io/api/?q=' + encodeURIComponent(query) + '&limit=1'
      try {
        const response = await fetch(url)
        const data = await response.json()
        if (data.features === undefined || data.features.length === 0) {
          return null
        }
        // Photon 返回的坐标顺序是 [经度, 纬度]
        const coords = data.features[0].geometry.coordinates
        return {
          lat: coords[1],
          lon: coords[0],
        }
      } catch {
        return null
      }
    },

    // 功能三（正地理编码）：地址 → 地图定位
    async geocodeAddress() {
      this.errorMessage = ''
      if (this.addressQuery === '') {
        return
      }

      const result = await this.forwardGeocode(this.addressQuery)
      if (result === null) {
        this.errorMessage = 'Address not found. Please try another one.'
        return
      }

      this.map.setView([result.lat, result.lon], 15)
      this.clearMarkers()
      this.addMarkerAt(result.lat, result.lon, this.addressQuery)

      // 调用反查接口拿到完整地址文字展示
      await this.reverseGeocode(result.lat, result.lon)
    },

    // 逆地理编码：坐标 → 地址（点击地图时触发，用 Photon 反向接口）
    async reverseGeocode(lat, lng) {
      const url =
        'https://photon.komoot.io/reverse?lat=' + lat + '&lon=' + lng + '&limit=1'
      try {
        const response = await fetch(url)
        const data = await response.json()
        if (data.features !== undefined && data.features.length > 0) {
          this.clickedAddress = this.buildAddressText(data.features[0])
        }
      } catch {
        // 反查失败不打断地图使用，保持之前的地址提示
      }
    },

    // 把 Photon 反查结果里的分散字段拼成一个地址文字
    buildAddressText(place) {
      const props = place.properties
      const parts = []
      if (props.housenumber !== undefined) {
        parts.push(props.housenumber)
      }
      if (props.street !== undefined) {
        parts.push(props.street)
      }
      if (props.city !== undefined) {
        parts.push(props.city)
      }
      if (props.state !== undefined) {
        parts.push(props.state)
      }
      if (props.country !== undefined) {
        parts.push(props.country)
      }
      if (parts.length === 0 && props.name !== undefined) {
        parts.push(props.name)
      }
      return parts.join(', ')
    },

    // 点击左侧结果列表中的地点 → 地图聚焦到该地点
    focusPlace(place) {
      const coords = place.geometry.coordinates
      this.map.setView([coords[1], coords[0]], 16)
    },
  },
}
</script>

<style scoped>
/* 地图容器必须要有明确高度才能正常显示 */
.map-box {
  height: 480px;
  width: 100%;
  background-color: #e9ecef;
  z-index: 0; /* 防止地图控件盖住页面其他元素 */
}
</style>