/**
 * 章丘传统村落地图交互功能
 * 此脚本提供示范区概览页面的交互式地图功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化地图
    const map = L.map('map-container').setView([36.681, 117.536], 11);
    
    // 添加底图图层（使用OpenStreetMap）
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // 定义村落数据
    const villages = [
        {
            name: "三德范村", 
            lat: 36.698, 
            lng: 117.578, 
            level: "national", 
            image: "village1.jpg",
            category: "中部村落",
            heritage: "古井群、明清建筑群",
            stats: {
                buildings: 23,
                craftsmen: 5,
                activities: 8
            },
            tags: ["明清建筑", "传统工艺", "国家级"]
        },
        {
            name: "白云湖村", 
            lat: 36.662, 
            lng: 117.498, 
            level: "province", 
            image: "village2.jpg",
            category: "南部村落",
            heritage: "传统民居、水系景观",
            stats: {
                buildings: 18,
                craftsmen: 3,
                activities: 5
            },
            tags: ["水乡文化", "民间艺术", "省级"]
        },
        {
            name: "朱家峪村", 
            lat: 36.705, 
            lng: 117.532, 
            level: "national", 
            image: "village3.jpg",
            category: "北部村落",
            heritage: "古村落空间格局、传统建筑",
            stats: {
                buildings: 26,
                craftsmen: 4,
                activities: 7
            },
            tags: ["传统村落", "村落布局", "国家级"]
        },
        {
            name: "明水古镇", 
            lat: 36.721, 
            lng: 117.612, 
            level: "national", 
            image: "village4.jpg",
            category: "北部村落",
            heritage: "明清街区、古商业建筑",
            stats: {
                buildings: 32,
                craftsmen: 6,
                activities: 9
            },
            tags: ["古镇", "商业文化", "国家级"]
        },
        {
            name: "宁家村", 
            lat: 36.675, 
            lng: 117.554, 
            level: "province", 
            image: "village5.jpg",
            category: "中部村落",
            heritage: "传统农耕文化、古民居",
            stats: {
                buildings: 15,
                craftsmen: 2,
                activities: 4
            },
            tags: ["农耕文化", "民俗活动", "省级"]
        },
        {
            name: "东营村", 
            lat: 36.692, 
            lng: 117.498, 
            level: "province", 
            image: "village6.jpg",
            category: "西部村落",
            heritage: "传统手工艺、文昌阁",
            stats: {
                buildings: 14,
                craftsmen: 7,
                activities: 5
            },
            tags: ["手工艺", "教育文化", "省级"]
        },
        {
            name: "西营村", 
            lat: 36.655, 
            lng: 117.522, 
            level: "local", 
            image: "village7.jpg",
            category: "南部村落",
            heritage: "古戏台、祠堂",
            stats: {
                buildings: 12,
                craftsmen: 2,
                activities: 6
            },
            tags: ["戏曲文化", "宗族文化", "区级"]
        },
        {
            name: "北宅科村", 
            lat: 36.712, 
            lng: 117.562, 
            level: "local", 
            image: "village8.jpg",
            category: "北部村落",
            heritage: "传统民居、古树",
            stats: {
                buildings: 11,
                craftsmen: 1,
                activities: 3
            },
            tags: ["自然景观", "民居建筑", "区级"]
        }
    ];
    
    // 添加GeoJSON边界层
    // fetch('data/zhangqiu-boundary.geojson')
    //     .then(response => response.json())
    //     .then(data => {
    //         L.geoJSON(data, {
    //             style: {
    //                 color: '#8b5a2b',
    //                 weight: 2,
    //                 opacity: 0.6,
    //                 fillColor: '#8b5a2b',
    //                 fillOpacity: 0.1
    //             }
    //         }).addTo(map);
    //     });
    
    // 创建图例
    const legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `
            <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
                <div style="margin-bottom: 5px; font-weight: bold;">村落等级</div>
                <div style="margin-bottom: 5px;"><span style="display: inline-block; width: 12px; height: 12px; background-color: #c53030; border-radius: 50%; margin-right: 5px;"></span> 国家级传统村落</div>
                <div style="margin-bottom: 5px;"><span style="display: inline-block; width: 12px; height: 12px; background-color: #3182ce; border-radius: 50%; margin-right: 5px;"></span> 省级传统村落</div>
                <div><span style="display: inline-block; width: 12px; height: 12px; background-color: #718096; border-radius: 50%; margin-right: 5px;"></span> 区级传统村落</div>
            </div>
        `;
        return div;
    };
    
    legend.addTo(map);
    
    // 创建筛选控件
    const filterControl = L.control({position: 'topleft'});
    
    filterControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-filter');
        div.innerHTML = `
            <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.4); margin-bottom: 10px;">
                <div style="margin-bottom: 5px; font-weight: bold;">筛选村落</div>
                <div style="margin-bottom: 5px;">
                    <label><input type="checkbox" class="level-filter" value="national" checked> 国家级</label>
                </div>
                <div style="margin-bottom: 5px;">
                    <label><input type="checkbox" class="level-filter" value="province" checked> 省级</label>
                </div>
                <div>
                    <label><input type="checkbox" class="level-filter" value="local" checked> 区级</label>
                </div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
                <div style="margin-bottom: 5px; font-weight: bold;">区域筛选</div>
                <div style="margin-bottom: 5px;">
                    <label><input type="checkbox" class="category-filter" value="北部村落" checked> 北部村落</label>
                </div>
                <div style="margin-bottom: 5px;">
                    <label><input type="checkbox" class="category-filter" value="中部村落" checked> 中部村落</label>
                </div>
                <div style="margin-bottom: 5px;">
                    <label><input type="checkbox" class="category-filter" value="南部村落" checked> 南部村落</label>
                </div>
                <div>
                    <label><input type="checkbox" class="category-filter" value="西部村落" checked> 西部村落</label>
                </div>
            </div>
        `;
        return div;
    };
    
    filterControl.addTo(map);
    
    // 防止点击筛选控件时触发地图事件
    document.addEventListener('DOMNodeInserted', function(e) {
        if (e.target.classList && e.target.classList.contains('map-filter')) {
            L.DomEvent.disableClickPropagation(e.target);
        }
    });
    
    // 创建村落标记和弹出窗口
    const markers = {};
    
    villages.forEach(village => {
        // 根据村落等级设置颜色
        let color;
        let levelText;
        
        switch(village.level) {
            case 'national':
                color = '#c53030';
                levelText = '国家级传统村落';
                break;
            case 'province':
                color = '#3182ce';
                levelText = '省级传统村落';
                break;
            default:
                color = '#718096';
                levelText = '区级传统村落';
        }
        
        // 创建标记
        const marker = L.circleMarker([village.lat, village.lng], {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
            data: village
        }).addTo(map);
        
        // 创建弹出窗口内容
        const popupContent = `
            <div style="text-align: center; width: 250px;">
                <img src="images/${village.image}" alt="${village.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">
                <h3 style="margin: 0 0 5px 0; color: #8b5a2b;">${village.name}</h3>
                <p style="margin: 0 0 10px 0; color: ${color};">${levelText}</p>
                <p style="margin: 0 0 10px 0; text-align: left;"><strong>代表遗产：</strong>${village.heritage}</p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <div style="text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; color: #c53030;">${village.stats.buildings}</div>
                        <div style="font-size: 12px; color: #666;">古建筑</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; color: #c53030;">${village.stats.craftsmen}</div>
                        <div style="font-size: 12px; color: #666;">传承人</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; color: #c53030;">${village.stats.activities}</div>
                        <div style="font-size: 12px; color: #666;">民俗活动</div>
                    </div>
                </div>
                <a href="#${village.name.toLowerCase()}" style="display: inline-block; background-color: #c53030; color: white; padding: 5px 15px; text-decoration: none; border-radius: 4px;">查看详情</a>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('mouseover', function(e) {
            this.openPopup();
        });
        
        // 存储标记引用
        markers[village.name] = {
            marker: marker,
            data: village
        };
    });
    
    // 筛选功能
    function applyFilters() {
        // 获取选中的等级
        const selectedLevels = [];
        document.querySelectorAll('.level-filter:checked').forEach(checkbox => {
            selectedLevels.push(checkbox.value);
        });
        
        // 获取选中的区域
        const selectedCategories = [];
        document.querySelectorAll('.category-filter:checked').forEach(checkbox => {
            selectedCategories.push(checkbox.value);
        });
        
        // 应用筛选
        for (const name in markers) {
            const village = markers[name].data;
            const marker = markers[name].marker;
            
            if (selectedLevels.includes(village.level) && selectedCategories.includes(village.category)) {
                marker.addTo(map);
            } else {
                marker.remove();
            }
        }
    }
    
    // 添加筛选事件监听器
    document.addEventListener('DOMNodeInserted', function(e) {
        if (e.target.classList && (e.target.classList.contains('map-filter') || e.target.classList.contains('level-filter') || e.target.classList.contains('category-filter'))) {
            e.target.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', applyFilters);
            });
        }
    });
    
    // 生成村落卡片
    const villageGrid = document.getElementById('villages-grid');
    
    if (villageGrid) {
        // 清空现有内容
        villageGrid.innerHTML = '';
        
        // 添加村落卡片
        villages.forEach(village => {
            const levelClass = village.level === 'national' ? 'national' : (village.level === 'province' ? 'province' : 'local');
            const levelText = village.level === 'national' ? '国家级' : (village.level === 'province' ? '省级' : '区级');
            
            const tagsHtml = village.tags.map(tag => `<span class="village-tag">${tag}</span>`).join('');
            
            const villageCard = document.createElement('div');
            villageCard.className = 'village-card';
            villageCard.setAttribute('data-aos', 'fade-up');
            villageCard.setAttribute('data-level', village.level);
            villageCard.setAttribute('data-category', village.category);
            villageCard.id = village.name.toLowerCase();
            
            villageCard.innerHTML = `
                <div class="village-card-image">
                    <img src="images/${village.image}" alt="${village.name}">
                </div>
                <div class="village-card-content">
                    <h3 class="village-card-title">${village.name}</h3>
                    <div class="village-card-stats">
                        <div class="village-stat">
                            <div class="stat-value">${village.stats.buildings}</div>
                            <div class="stat-label">古建筑</div>
                        </div>
                        <div class="village-stat">
                            <div class="stat-value">${village.stats.craftsmen}</div>
                            <div class="stat-label">传承人</div>
                        </div>
                        <div class="village-stat">
                            <div class="stat-value">${village.stats.activities}</div>
                            <div class="stat-label">民俗活动</div>
                        </div>
                    </div>
                    <div class="village-tags">
                        ${tagsHtml}
                        <span class="village-tag village-level ${levelClass}">${levelText}</span>
                    </div>
                    <p>${village.heritage}</p>
                    <a href="#${village.name.toLowerCase()}" class="btn-secondary view-village-btn" data-village="${village.name}">查看详情</a>
                </div>
            `;
            
            villageGrid.appendChild(villageCard);
            
            // 添加点击事件，点击卡片时在地图上显示对应村落
            villageCard.querySelector('.view-village-btn').addEventListener('click', function(e) {
                const villageName = this.getAttribute('data-village');
                const marker = markers[villageName].marker;
                const data = markers[villageName].data;
                
                map.setView([data.lat, data.lng], 14);
                marker.openPopup();
                
                // 平滑滚动到地图
                document.getElementById('map-container').scrollIntoView({ 
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // 村落列表筛选功能
    const villageFilterButtons = document.querySelectorAll('.village-filter-btn');
    
    if (villageFilterButtons.length > 0) {
        villageFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 更新激活按钮
                villageFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const villageCards = document.querySelectorAll('.village-card');
                
                villageCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else if (filter === 'national' || filter === 'province' || filter === 'local') {
                        if (card.getAttribute('data-level') === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    } else if (filter === 'north' || filter === 'central' || filter === 'south' || filter === 'west') {
                        const categoryMap = {
                            'north': '北部村落',
                            'central': '中部村落',
                            'south': '南部村落',
                            'west': '西部村落'
                        };
                        
                        if (card.getAttribute('data-category') === categoryMap[filter]) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // 统计图表
    const statsChart = document.getElementById('village-stats-chart');
    
    if (statsChart && window.Chart) {
        // 计算统计数据
        const nationalCount = villages.filter(v => v.level === 'national').length;
        const provinceCount = villages.filter(v => v.level === 'province').length;
        const localCount = villages.filter(v => v.level === 'local').length;
        
        const totalBuildings = villages.reduce((sum, v) => sum + v.stats.buildings, 0);
        const totalCraftsmen = villages.reduce((sum, v) => sum + v.stats.craftsmen, 0);
        const totalActivities = villages.reduce((sum, v) => sum + v.stats.activities, 0);
        
        // 创建图表
        new Chart(statsChart, {
            type: 'doughnut',
            data: {
                labels: ['国家级村落', '省级村落', '区级村落'],
                datasets: [{
                    label: '村落数量',
                    data: [nationalCount, provinceCount, localCount],
                    backgroundColor: ['#c53030', '#3182ce', '#718096']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        // 创建资源统计图
        const resourcesChart = document.getElementById('resources-stats-chart');
        
        if (resourcesChart && window.Chart) {
            new Chart(resourcesChart, {
                type: 'bar',
                data: {
                    labels: ['古建筑', '传统工艺传承人', '民俗活动'],
                    datasets: [{
                        label: '数量',
                        data: [totalBuildings, totalCraftsmen, totalActivities],
                        backgroundColor: ['#8b5a2b', '#3182ce', '#c53030']
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }
}); 