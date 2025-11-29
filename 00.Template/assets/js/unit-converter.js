/**
 * SISTEMA DE CONVERSÃO DE UNIDADES DE MEDIDA
 * ===========================================
 * Sistema modular para conversão automática de unidades
 * baseado no idioma/região do usuário
 * 
 * Autor: MiniMax Agent
 * Data: 2025-11-21
 */

(function() {
    'use strict';

    /**
     * Configurações de unidades por região/idioma
     */
    const UNIT_SYSTEMS = {
        // Sistema Internacional (SI) - Padrão
        'pt-BR': {
            name: 'Sistema Internacional (SI)',
            weight: { unit: 'kg', label: 'Quilogramas' },
            height: { unit: 'cm', label: 'Centímetros' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Mililitros' },
            pressure: { unit: 'mmHg', label: 'Milímetros de Mercúrio' }
        },
        'es': {
            name: 'Sistema Internacional (SI)',
            weight: { unit: 'kg', label: 'Kilogramos' },
            height: { unit: 'cm', label: 'Centímetros' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Mililitros' },
            pressure: { unit: 'mmHg', label: 'Milímetros de Mercurio' }
        },
        'fr': {
            name: 'Système International (SI)',
            weight: { unit: 'kg', label: 'Kilogrammes' },
            height: { unit: 'cm', label: 'Centimètres' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Millilitres' },
            pressure: { unit: 'mmHg', label: 'Millimètres de Mercure' }
        },
        'de': {
            name: 'Internationales Einheitensystem (SI)',
            weight: { unit: 'kg', label: 'Kilogramm' },
            height: { unit: 'cm', label: 'Zentimeter' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Milliliter' },
            pressure: { unit: 'mmHg', label: 'Millimeter Quecksilbersäule' }
        },
        'it': {
            name: 'Sistema Internazionale (SI)',
            weight: { unit: 'kg', label: 'Chilogrammi' },
            height: { unit: 'cm', label: 'Centimetri' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Millilitri' },
            pressure: { unit: 'mmHg', label: 'Millimetri di Mercurio' }
        },
        
        // Sistema Imperial - USA
        'en': {
            name: 'Imperial System (US)',
            weight: { unit: 'lbs', label: 'Pounds' },
            height: { unit: 'in', label: 'Inches' },
            temperature: { unit: '°F', label: 'Fahrenheit' },
            volume: { unit: 'fl oz', label: 'Fluid Ounces' },
            pressure: { unit: 'mmHg', label: 'Millimeters of Mercury' }
        },
        
        // Sistema UK
        'en-GB': {
            name: 'Imperial System (UK)',
            weight: { unit: 'st', label: 'Stones' },
            height: { unit: 'ft', label: 'Feet' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Millilitres' },
            pressure: { unit: 'mmHg', label: 'Millimetres of Mercury' }
        },
        
        // Sistemas Asiáticos
        'ja': {
            name: '国際単位系 (SI)',
            weight: { unit: 'kg', label: 'キログラム' },
            height: { unit: 'cm', label: 'センチメートル' },
            temperature: { unit: '°C', label: '摂氏' },
            volume: { unit: 'mL', label: 'ミリリットル' },
            pressure: { unit: 'mmHg', label: 'ミリメートル水銀柱' }
        },
        'ko': {
            name: '국제 단위계 (SI)',
            weight: { unit: 'kg', label: '킬로그램' },
            height: { unit: 'cm', label: '센티미터' },
            temperature: { unit: '°C', label: '섭씨' },
            volume: { unit: 'mL', label: '밀리리터' },
            pressure: { unit: 'mmHg', label: '수은주밀리미터' }
        },
        'zh': {
            name: '国际单位制 (SI)',
            weight: { unit: 'kg', label: '千克' },
            height: { unit: 'cm', label: '厘米' },
            temperature: { unit: '°C', label: '摄氏度' },
            volume: { unit: 'mL', label: '毫升' },
            pressure: { unit: 'mmHg', label: '毫米汞柱' }
        },
        'hi': {
            name: 'अंतर्राष्ट्रीय प्रणाली (SI)',
            weight: { unit: 'kg', label: 'किलोग्राम' },
            height: { unit: 'cm', label: 'सेंटीमीटर' },
            temperature: { unit: '°C', label: 'सेल्सियस' },
            volume: { unit: 'mL', label: 'मिलीलीटर' },
            pressure: { unit: 'mmHg', label: 'मिलीमीटर पारा' }
        },
        
        // Sistemas Europeus
        'ru': {
            name: 'Международная система единиц (SI)',
            weight: { unit: 'kg', label: 'Килограммы' },
            height: { unit: 'cm', label: 'Сантиметры' },
            temperature: { unit: '°C', label: 'Цельсий' },
            volume: { unit: 'мл', label: 'Миллилитры' },
            pressure: { unit: 'мм рт.ст.', label: 'Миллиметры ртутного столба' }
        },
        'tr': {
            name: 'Uluslararası Birim Sistemi (SI)',
            weight: { unit: 'kg', label: 'Kilogram' },
            height: { unit: 'cm', label: 'Santimetre' },
            temperature: { unit: '°C', label: 'Santigrat' },
            volume: { unit: 'mL', label: 'Mililitre' },
            pressure: { unit: 'mmHg', label: 'Milimetre Cıva' }
        },
        'nl': {
            name: 'Internationaal Stelsel (SI)',
            weight: { unit: 'kg', label: 'Kilogram' },
            height: { unit: 'cm', label: 'Centimeter' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Milliliter' },
            pressure: { unit: 'mmHg', label: 'Millimeter Kwik' }
        },
        'pl': {
            name: 'Układ SI',
            weight: { unit: 'kg', label: 'Kilogramy' },
            height: { unit: 'cm', label: 'Centymetry' },
            temperature: { unit: '°C', label: 'Celsjusz' },
            volume: { unit: 'mL', label: 'Mililitry' },
            pressure: { unit: 'mmHg', label: 'Milimetry słupa rtęci' }
        },
        'sv': {
            name: 'Internationella måttenhetssystemet (SI)',
            weight: { unit: 'kg', label: 'Kilogram' },
            height: { unit: 'cm', label: 'Centimeter' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Milliliter' },
            pressure: { unit: 'mmHg', label: 'Millimeter kvicksilver' }
        },
        'uk': {
            name: 'Міжнародна система одиниць (SI)',
            weight: { unit: 'кг', label: 'Кілограми' },
            height: { unit: 'см', label: 'Сантиметри' },
            temperature: { unit: '°C', label: 'Цельсій' },
            volume: { unit: 'мл', label: 'Мілілітри' },
            pressure: { unit: 'мм рт.ст.', label: 'Міліметри ртутного стовпа' }
        },
        
        // Sistemas do Sudeste Asiático
        'id': {
            name: 'Sistem Internasional (SI)',
            weight: { unit: 'kg', label: 'Kilogram' },
            height: { unit: 'cm', label: 'Sentimeter' },
            temperature: { unit: '°C', label: 'Celsius' },
            volume: { unit: 'mL', label: 'Mililiter' },
            pressure: { unit: 'mmHg', label: 'Milimeter Merkuri' }
        },
        'vi': {
            name: 'Hệ đo lường quốc tế (SI)',
            weight: { unit: 'kg', label: 'Kilôgam' },
            height: { unit: 'cm', label: 'Xentimét' },
            temperature: { unit: '°C', label: 'Độ C' },
            volume: { unit: 'mL', label: 'Mililit' },
            pressure: { unit: 'mmHg', label: 'Milimet thủy ngân' }
        },
        
        // Sistema Árabe
        'ar': {
            name: 'النظام الدولي للوحدات',
            weight: { unit: 'كجم', label: 'كيلوغرام' },
            height: { unit: 'سم', label: 'سنتيمتر' },
            temperature: { unit: '°م', label: 'درجة مئوية' },
            volume: { unit: 'مل', label: 'ميليلتر' },
            pressure: { unit: 'ملم زئبق', label: 'ميليمتر زئبق' }
        }
    };

    /**
     * Funções de conversão
     */
    const CONVERSIONS = {
        // Peso
        kgToLbs: (kg) => kg * 2.20462,
        lbsToKg: (lbs) => lbs / 2.20462,
        kgToSt: (kg) => kg * 0.157473,
        stToKg: (st) => st / 0.157473,
        
        // Altura
        cmToIn: (cm) => cm * 0.393701,
        inToCm: (inches) => inches / 0.393701,
        cmToFt: (cm) => cm * 0.0328084,
        ftToCm: (ft) => ft / 0.0328084,
        
        // Temperatura
        celsiusToFahrenheit: (c) => (c * 9/5) + 32,
        fahrenheitToCelsius: (f) => (f - 32) * 5/9,
        
        // Volume
        mlToFlOz: (ml) => ml * 0.033814,
        flOzToMl: (oz) => oz / 0.033814
    };

    /**
     * Classe principal do conversor de unidades
     */
    class UnitConverter {
        constructor() {
            this.currentLang = this.detectLanguage();
            this.currentSystem = UNIT_SYSTEMS[this.currentLang] || UNIT_SYSTEMS['pt-BR'];
            this.initializeSelector();
        }

        /**
         * Detecta o idioma da página
         */
        detectLanguage() {
            const htmlLang = document.documentElement.lang;
            return htmlLang || 'pt-BR';
        }

        /**
         * Inicializa o seletor de unidades na interface
         */
        initializeSelector() {
            const selectors = document.querySelectorAll('.unit-selector');
            
            selectors.forEach(selector => {
                this.renderSelector(selector);
            });
        }

        /**
         * Renderiza o seletor de unidades
         */
        renderSelector(container) {
            const html = `
                <div class="unit-system-selector">
                    <label for="unit-system-select">
                        <i class="fa-solid fa-ruler-combined"></i>
                        Sistema de Unidades:
                    </label>
                    <select id="unit-system-select" class="unit-select">
                        ${Object.keys(UNIT_SYSTEMS).map(lang => `
                            <option value="${lang}" ${lang === this.currentLang ? 'selected' : ''}>
                                ${UNIT_SYSTEMS[lang].name}
                            </option>
                        `).join('')}
                    </select>
                </div>
            `;
            
            container.innerHTML = html;
            
            // Event listener para mudança de sistema
            const select = container.querySelector('#unit-system-select');
            select.addEventListener('change', (e) => {
                this.changeSystem(e.target.value);
            });
        }

        /**
         * Muda o sistema de unidades
         */
        changeSystem(lang) {
            this.currentLang = lang;
            this.currentSystem = UNIT_SYSTEMS[lang];
            this.updateAllUnits();
            
            // Dispara evento customizado
            window.dispatchEvent(new CustomEvent('unitSystemChanged', {
                detail: { lang, system: this.currentSystem }
            }));
        }

        /**
         * Atualiza todos os campos com unidades
         */
        updateAllUnits() {
            // Atualizar labels de peso
            document.querySelectorAll('[data-unit-type="weight"]').forEach(el => {
                el.textContent = this.currentSystem.weight.unit;
            });
            
            // Atualizar labels de altura
            document.querySelectorAll('[data-unit-type="height"]').forEach(el => {
                el.textContent = this.currentSystem.height.unit;
            });
            
            // Atualizar labels de temperatura
            document.querySelectorAll('[data-unit-type="temperature"]').forEach(el => {
                el.textContent = this.currentSystem.temperature.unit;
            });
            
            // Atualizar labels de volume
            document.querySelectorAll('[data-unit-type="volume"]').forEach(el => {
                el.textContent = this.currentSystem.volume.unit;
            });
        }

        /**
         * Converte valor de peso
         */
        convertWeight(value, fromUnit, toUnit) {
            if (fromUnit === toUnit) return value;
            
            // Converter tudo para kg primeiro
            let kg = value;
            if (fromUnit === 'lbs') kg = CONVERSIONS.lbsToKg(value);
            if (fromUnit === 'st') kg = CONVERSIONS.stToKg(value);
            
            // Converter de kg para unidade alvo
            if (toUnit === 'lbs') return CONVERSIONS.kgToLbs(kg);
            if (toUnit === 'st') return CONVERSIONS.kgToSt(kg);
            return kg;
        }

        /**
         * Converte valor de altura
         */
        convertHeight(value, fromUnit, toUnit) {
            if (fromUnit === toUnit) return value;
            
            // Converter tudo para cm primeiro
            let cm = value;
            if (fromUnit === 'in') cm = CONVERSIONS.inToCm(value);
            if (fromUnit === 'ft') cm = CONVERSIONS.ftToCm(value);
            
            // Converter de cm para unidade alvo
            if (toUnit === 'in') return CONVERSIONS.cmToIn(cm);
            if (toUnit === 'ft') return CONVERSIONS.cmToFt(cm);
            return cm;
        }

        /**
         * Converte temperatura
         */
        convertTemperature(value, fromUnit, toUnit) {
            if (fromUnit === toUnit) return value;
            
            if (fromUnit === '°C' && toUnit === '°F') {
                return CONVERSIONS.celsiusToFahrenheit(value);
            }
            if (fromUnit === '°F' && toUnit === '°C') {
                return CONVERSIONS.fahrenheitToCelsius(value);
            }
            return value;
        }

        /**
         * Obtém o sistema atual
         */
        getCurrentSystem() {
            return this.currentSystem;
        }
    }

    // Inicializar conversor quando DOM estiver pronto
    let converter;
    
    function initUnitConverter() {
        converter = new UnitConverter();
        window.unitConverter = converter; // Expor globalmente
        console.log('✓ Sistema de conversão de unidades inicializado');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnitConverter);
    } else {
        initUnitConverter();
    }

})();
