'use strict';

const C = mpiSignalCourse;
const $ = id => document.getElementById(id);
const view = $('view');

let lang = 'kk';

try {
    lang = localStorage.getItem('mpiLang') || 'kk';
} catch {}

if (!['kk', 'ru', 'en'].includes(lang)) lang = 'kk';

const t = (k, r, e) => ({
    kk: k,
    ru: r,
    en: e
})[lang];

const esc = s => String(s ?? '').replace(
    /[&<>"']/g,
    c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[c]
);

// Модуль атаулары

const names = () => [
    t('Процестер және рангтер',
      'Процессы и ранги',
      'Processes and ranks'),

    t('Хабар алмасу',
      'Обмен сообщениями',
      'Message passing'),

    t('Редукция және деректер типтері',
      'Редукция и типы данных',
      'Reduction and datatypes'),

    t('Ұжымдық операциялар',
      'Коллективные операции',
      'Collective operations'),

    t('Виртуалды топологиялар',
      'Виртуальные топологии',
      'Virtual topologies')
];

// Прогресті сақтау

let done = {};

try {
    done = JSON.parse(
        localStorage.getItem('mpiDone') || '{}'
    ) || {};
} catch {}

const total = C.groups.flat().length;

function save() {
    try {
        localStorage.setItem(
            'mpiDone',
            JSON.stringify(done)
        );
    } catch {}
}

function completedCount() {
    return C.groups.flat().filter(n => done[n]).length;
}

function title(a, b = '') {
    return `
        <div class="title-block">
            <div class="eyebrow">MPI SIGNAL PRO / 03</div>
            <h1>${esc(a)}</h1>
            <p>${esc(b)}</p>
        </div>
    `;
}

function list(a) {
    return `
        <ol>
            ${a.map(x => `<li>${esc(x)}</li>`).join('')}
        </ol>
    `;
}

// Модульдер тізімі

function modules() {
    return `
        <div class="course-route">

            ${C.groups.map((g, i) => `
                <a class="course-stop"
                   href="#module/${i + 1}/${g[0]}">

                    <span class="stop-number">
                        0${i + 1}
                    </span>

                    <div>
                        <h2>${names()[i]}</h2>
                        <p>
                            ${g.map(n => 'MPIBegin' + n).join(' · ')}
                        </p>
                    </div>

                    <span class="stop-count">
                        ${g.filter(n => done[n]).length}/${g.length}
                    </span>

                    <span class="stop-arrow">→</span>

                </a>
            `).join('')}

        </div>
    `;
}

// Анимациялық MPI желісі

function network() {
    return `
        <div class="hero-network">

            <div class="network-label">
                ● MPI_COMM_WORLD
                <span>LIVE DEMO</span>
            </div>

            <svg viewBox="0 0 480 320"
                 role="img"
                 aria-label="MPI Broadcast">

                <defs>
                    <pattern id="grid"
                             width="24"
                             height="24"
                             patternUnits="userSpaceOnUse">

                        <path d="M24 0H0V24"
                              fill="none"
                              stroke="#24374c"/>
                    </pattern>
                </defs>

                <rect width="480"
                      height="320"
                      fill="url(#grid)"/>

                ${[0, 1, 2, 3].map(i => {

                    const y = 48 + i * 74;

                    return `
                        <path
                            d="M116 160 C220 160 250 ${y} 355 ${y}"
                            class="net-path"/>

                        <circle r="5" fill="#77ffe0">

                            <animateMotion
                                dur="${2.1 + i * .32}s"
                                repeatCount="indefinite"
                                path="M116 160 C220 160 250 ${y} 355 ${y}"/>

                        </circle>

                        <rect x="355"
                              y="${y - 23}"
                              width="86"
                              height="46"
                              rx="12"
                              class="net-node"/>

                        <text x="398"
                              y="${y + 5}"
                              text-anchor="middle"
                              class="net-text">
                            P${i + 1}
                        </text>
                    `;

                }).join('')}

                <rect x="30"
                      y="125"
                      width="90"
                      height="70"
                      rx="16"
                      class="net-root"/>

                <text x="75"
                      y="155"
                      text-anchor="middle"
                      class="net-text">
                    P0
                </text>

                <text x="75"
                      y="175"
                      text-anchor="middle"
                      class="net-small">
                    ROOT
                </text>

            </svg>

            <div class="network-label">
                MPI_Bcast
                <span>5 PROCESSES</span>
            </div>

        </div>
    `;
}

// Басты бет

function home() {

    const n = completedCount();

    const metrics = [
        ['05', t('Оқу модулі', 'Модулей', 'Modules')],
        [total, t('Тапсырма', 'Задач', 'Exercises')],
        ['03', t('Тіл', 'Языка', 'Languages')],
        [
            Math.round(n / total * 100) + '%',
            t('Оқу прогресі', 'Прогресс', 'Progress')
        ]
    ];

    view.innerHTML = `

        <section class="hero">

            <div class="hero-copy">

                <div class="eyebrow">
                    <span class="live-dot"></span>
                    MPI SIGNAL / LEARNING LAB
                </div>

                <h1>
                    ${t(
                        'Параллельді ойла.',
                        'Думай параллельно.',
                        'Think in parallel.'
                    )}

                    <span>MPI.</span>
                </h1>

                <p>
                    ${t(
                        'Параллельді бағдарламалау әлемін зертте. 5 оқу модулі, 36 практикалық тапсырма және интерактивті симулятор.',
                        'Изучай параллельное программирование: 5 модулей, 36 задач и интерактивный симулятор.',
                        'Explore parallel programming with 5 modules, 36 exercises and an interactive simulator.'
                    )}
                </p>

                <div class="actions">

                    <a class="button primary" href="#course">
                        ${t(
                            'Оқуды бастау',
                            'Начать обучение',
                            'Start learning'
                        )} →
                    </a>

                    <a class="button" href="#tools">
                        ▷ ${t(
                            'Симулятор',
                            'Симулятор',
                            'Simulator'
                        )}
                    </a>

                </div>

            </div>

            ${network()}

        </section>

        <div class="metric-grid">

            ${metrics.map(([v, l]) => `
                <div class="metric">
                    <strong>${v}</strong>
                    <span>${l}</span>
                </div>
            `).join('')}

        </div>

        <div class="section-head">

            <div>
                <div class="eyebrow">LEARNING PATH</div>

                <h2>
                    ${t(
                        'Оқу бағыты',
                        'План курса',
                        'Course roadmap'
                    )}
                </h2>
            </div>

            <a class="button" href="#course">
                ${t(
                    'Барлығы',
                    'Все модули',
                    'All modules'
                )} →
            </a>

        </div>

        ${modules()}
    `;
}

// Оқу модульдері және іздеу

function course() {

    view.innerHTML = title(

        t(
            'Оқу модульдері',
            'Модули курса',
            'Course modules'
        ),

        t(
            '3-нұсқа · 36 тапсырма',
            'Вариант 3 · 36 задач',
            'Variant 3 · 36 exercises'
        )

    ) + `

        <div class="search-box">

            <label for="taskSearch">
                ${t(
                    'Тапсырманы іздеу',
                    'Поиск задания',
                    'Find an exercise'
                )}
            </label>

            <input id="taskSearch"
                   type="search"
                   placeholder="MPIBegin48 / MPI_Reduce">

            <div id="searchResults"></div>

        </div>

        ${modules()}
    `;

    $('taskSearch').oninput = () => {

        const q = $('taskSearch')
            .value.trim().toLowerCase();

        if (!q) {
            $('searchResults').innerHTML = '';
            return;
        }

        const results = C.groups.flatMap((g, i) => {

            return g.filter(n => {

                const task = C.exercises[n];

                if (!task) return false;

                const text = (
                    'MPIBegin' + n + ' ' +
                    task.statement[lang] + ' ' +
                    task.source
                ).toLowerCase();

                return text.includes(q);

            }).map(n => `

                <a class="search-result"
                   href="#module/${i + 1}/${n}">

                    <strong>MPIBegin${n}</strong>

                    <span>
                        ${esc(C.exercises[n].statement[lang])}
                    </span>

                </a>
            `);
        });

        $('searchResults').innerHTML =
            results.join('') ||
            `<p>${t(
                'Тапсырма табылмады',
                'Задание не найдено',
                'No results'
            )}</p>`;
    };
}

// Тапсырманың жеке беті

function modulePage(m, n, tab) {

    const g = C.groups[m - 1];

    if (!g) {
        course();
        return;
    }

    n = g.includes(n) ? n : g[0];

    const a = C.exercises[n];
    const th = C.theory[m]?.[lang];

    if (!a) {

        view.innerHTML = title('MPIBegin' + n) +
            `<section class="sheet">
                <p>${t(
                    'Тапсырма course-data.js файлына енгізілмеген.',
                    'Задание отсутствует в course-data.js.',
                    'Exercise is missing from course-data.js.'
                )}</p>

                <a class="button" href="#course">
                    ${t('Артқа', 'Назад', 'Back')}
                </a>
            </section>`;

        return;
    }

    const tabs = [
        ['task', t('Тапсырма', 'Задание', 'Task')],
        ['theory', t('Теория', 'Теория', 'Theory')],
        ['code', t('C++ коды', 'Код C++', 'C++ code')],
        ['result', t('Нәтиже', 'Результат', 'Result')]
    ];

    if (!tabs.some(x => x[0] === tab)) {
        tab = 'task';
    }

    let body = '';

    // Тапсырманың шарты

    if (tab === 'task') {

        body = `
            <section class="sheet">

                <div class="eyebrow">
                    PRACTICAL EXERCISE
                </div>

                <h2>MPIBegin${n}</h2>

                <p>${esc(a.statement[lang])}</p>

                <details>

                    <summary>
                        ${t(
                            'Түпнұсқа шарт',
                            'Оригинал задания',
                            'Original statement'
                        )}
                    </summary>

                    <p>${esc(a.original)}</p>

                </details>

                <h2>
                    ${t(
                        'Орындау алгоритмі',
                        'Алгоритм',
                        'Algorithm'
                    )}
                </h2>

                ${list(a.steps[lang])}

            </section>
        `;
    }

    // Теория бөлімі

    if (tab === 'theory') {

        body = th ? `

            <section class="sheet">

                <div class="eyebrow">
                    THEORY / MODULE 0${m}
                </div>

              <div class="theory-heading">

    <h2>
        ${t(
            'Нөлден бастап үйрену',
            'Обучение с нуля',
            'Learn from scratch'
        )}
    </h2>

    <div class="theory-count">
        ${th.definitions.length}
        ${t(
            'теориялық анықтама',
            'определений',
            'definitions'
        )}
    </div>

</div>

<div class="theory-notice">
    💡 ${t(
        'Алдымен негізгі ұғымдарды оқып шық. Содан кейін мысалдар мен практикалық тапсырмаларға өт.',
        'Сначала изучите основные понятия, затем переходите к примерам и практическим заданиям.',
        'Study the basic concepts first, then proceed to examples and practical exercises.'
    )}
</div>

<input
    type="search"
    class="theory-search"
    placeholder="${t(
        'Анықтаманы іздеу...',
        'Поиск определения...',
        'Search definitions...'
    )}"
    oninput="
        const q = this.value.toLowerCase().trim();
        document.querySelectorAll('.theory-card')
        .forEach(card => {
            card.hidden =
                !card.textContent.toLowerCase().includes(q);
        });
    "
>

<div class="theory-grid">

    ${th.definitions.map(([a, b], i) => `

        <article class="theory-card">

            <div class="theory-card-number">
                ${String(i + 1).padStart(2, '0')}
            </div>

            <h3>${esc(a)}</h3>

            <p>${esc(b)}</p>

        </article>

    `).join('')}

</div>

                <h2>
                    ${t(
                        'Маңызды ескертулер',
                        'Важные замечания',
                        'Pitfalls'
                    )}
                </h2>

                ${list(th.pitfalls)}

                <h2>
                    ${t('Мысал', 'Пример', 'Example')}
                </h2>

                ${list(th.example)}

            </section>

        ` : `
            <section class="sheet">
                <p>${t(
                    'Теория енгізілмеген',
                    'Теория отсутствует',
                    'Theory is missing'
                )}</p>
            </section>
        `;
    }

    // C++ коды

    if (tab === 'code') {

        body = `

            <section class="sheet">

                <div class="section-head">

                    <div>
                        <div class="eyebrow">SOURCE CODE</div>
                        <h2>MPIBegin${n}.cpp</h2>
                    </div>

                    <div class="actions">

                        <button id="copyCode">
                            ${t(
                                'Көшіру',
                                'Копировать',
                                'Copy'
                            )}
                        </button>

                        <button id="downloadCode">
                            .cpp ↓
                        </button>

                    </div>

                </div>

                <pre><code>${esc(a.source)}</code></pre>

                <h3>
                    ${t(
                        'Іске қосу командалары',
                        'Команды запуска',
                        'Run commands'
                    )}
                </h3>

                <pre>mpic++ MPIBegin${n}.cpp -o mpi
mpiexec -n ${a.np} ./mpi</pre>

            </section>
        `;
    }

    // Күтілетін нәтиже

    if (tab === 'result') {

        body = `

            <section class="sheet">

                <div class="eyebrow">OUTPUT CONSOLE</div>

                <h2>
                    ${t(
                        'Күтілетін нәтиже',
                        'Ожидаемый результат',
                        'Expected result'
                    )}
                </h2>

                <p>
                    ${t(
                        'Кодтағы мысал деректерінің нәтижесі. Браузер MPI кодын тікелей орындамайды.',
                        'Результат для примера в коде. Браузер не выполняет MPI напрямую.',
                        'Expected sample result. The browser does not execute MPI directly.'
                    )}
                </p>

                <pre>${esc(a.expected)}</pre>

                <a class="button primary" href="#tools">
                    ▷ ${t(
                        'Симуляторды ашу',
                        'Открыть симулятор',
                        'Open simulator'
                    )}
                </a>

            </section>
        `;
    }

    view.innerHTML = title(
        names()[m - 1],
        'MODULE 0' + m + ' / MPIBegin' + n
    ) + `

        <div class="module-workspace">

            <aside class="exercise-rail">

                <h3>
                    ${t(
                        'Тапсырмалар',
                        'Задачи',
                        'Exercises'
                    )}
                </h3>

                <div class="exercise-ribbon">

                    ${g.map(x => `

                        <a href="#module/${m}/${x}/${tab}"
                           ${x === n ? 'aria-current="page"' : ''}>

                            ${done[x] ? '✓ ' : ''}${x}

                        </a>

                    `).join('')}

                </div>

            </aside>

            <div class="workspace-tabs">

                ${tabs.map(([x, l]) => `

                    <a class="workspace-tab button"
                       aria-selected="${tab === x}"
                       href="#module/${m}/${n}/${x}">

                        ${l}

                    </a>

                `).join('')}

            </div>

            <div class="workspace-panel">

                ${body}

                <div class="actions" style="margin-top:1rem">

                    <button id="complete" class="primary">

                        ${done[n] ?

                            t(
                                '✓ Орындалды',
                                '✓ Выполнено',
                                '✓ Completed'
                            ) :

                            t(
                                'Орындалды деп белгілеу',
                                'Отметить выполненным',
                                'Mark complete'
                            )
                        }

                    </button>

                    ${g.indexOf(n) < g.length - 1 ? `

                        <a class="button"
                           href="#module/${m}/${g[g.indexOf(n) + 1]}">

                            ${t(
                                'Келесі',
                                'Далее',
                                'Next'
                            )} →

                        </a>

                    ` : ''}

                </div>

            </div>

        </div>
    `;

    $('complete').onclick = () => {
        done[n] = !done[n];
        save();
        render();
    };

    // Кодты көшіру

    if ($('copyCode')) {

        $('copyCode').onclick = async () => {

            try {

                await navigator.clipboard.writeText(a.source);

            } catch {

                const z = document.createElement('textarea');

                z.value = a.source;
                document.body.append(z);
                z.select();

                document.execCommand('copy');

                z.remove();
            }

            $('copyCode').textContent = '✓ ' + t(
                'Көшірілді',
                'Скопировано',
                'Copied'
            );
        };
    }

    // CPP файл ретінде сақтау

    if ($('downloadCode')) {

        $('downloadCode').onclick = () => {

            const u = URL.createObjectURL(
                new Blob([a.source], {
                    type: 'text/plain'
                })
            );

            const l = document.createElement('a');

            l.href = u;
            l.download = `MPIBegin${n}.cpp`;

            l.click();

            setTimeout(() => {
                URL.revokeObjectURL(u);
            }, 1000);
        };
    }
}

// Интерактивті MPI симуляторы

function tools() {

    view.innerHTML = title(

        t(
            'MPI симуляторы',
            'Симулятор MPI',
            'MPI simulator'
        ),

        t(
            'Параллельді операцияларды интерактивті модельдеу',
            'Интерактивное моделирование параллельных операций',
            'Interactive simulation of parallel operations'
        )

    ) + `

        <section class="bench">

            <div class="eyebrow">INTERACTIVE LAB</div>

            <h2>MPI Communication Lab</h2>

            <div class="lab-split">

                <form id="sim">

                    <label>

                        MPI Operation

                        <select id="op">

                            <option>MPI_Gather</option>
                            <option>MPI_Allgather</option>
                            <option>MPI_Scatter</option>
                            <option>MPI_Reduce</option>
                            <option>MPI_Allreduce</option>
                            <option>MPI_Bcast</option>
                            <option>MPI_Scan</option>

                        </select>

                    </label>

                    <p>
                        ${t(
                            'Сандарды үтір арқылы енгіз',
                            'Введите числа через запятую',
                            'Enter comma-separated numbers'
                        )}
                    </p>

                    <input id="values"
                           value="10,20,30,40"
                           style="width:100%">

                    <p>Reduction operation</p>

                    <select id="reduceType">

                        <option value="sum">MPI_SUM</option>
                        <option value="max">MPI_MAX</option>
                        <option value="min">MPI_MIN</option>
                        <option value="prod">MPI_PROD</option>

                    </select>

                    <div class="actions"
                         style="margin-top:1rem">

                        <button class="primary" type="submit">

                            ▷ ${t(
                                'Іске қосу',
                                'Запустить',
                                'Run'
                            )}

                        </button>

                        <button id="randomValues"
                                type="button">

                            ${t(
                                'Кездейсоқ сандар',
                                'Случайные числа',
                                'Random numbers'
                            )}

                        </button>

                    </div>

                </form>

                <div class="output" id="simOut"></div>

            </div>

        </section>

        <section class="sheet" style="margin-top:1rem">

            <h2>
                ${t(
                    'Процестер визуализациясы',
                    'Визуализация процессов',
                    'Process visualization'
                )}
            </h2>

            <div id="simVisual" class="metric-grid"></div>

        </section>

    `;

    function calculate(values, type) {

        if (type === 'max') {
            return Math.max(...values);
        }

        if (type === 'min') {
            return Math.min(...values);
        }

        if (type === 'prod') {
            return values.reduce((a, b) => a * b, 1);
        }

        return values.reduce((a, b) => a + b, 0);
    }

    function run() {

        const a = $('values').value
            .split(',')
            .map(x => x.trim());

        const b = a.map(Number);

        if (
            !a.length ||
            a.some(x => !x) ||
            b.some(x => !Number.isFinite(x)) ||
            b.length > 32
        ) {

            $('simOut').textContent = t(
                '1–32 дұрыс сан енгізіңіз',
                'Введите 1–32 корректных числа',
                'Enter 1–32 valid numbers'
            );

            $('simVisual').innerHTML = '';

            return;
        }

        const op = $('op').value;
        const type = $('reduceType').value;

        const reduced = calculate(b, type);

        let out = [];

        switch (op) {

            case 'MPI_Gather':

                out = [[0, b]];
                break;

            case 'MPI_Allgather':

                out = b.map((x, i) => [i, b]);
                break;

            case 'MPI_Scatter':

                out = b.map((x, i) => [i, [x]]);
                break;

            case 'MPI_Reduce':

                out = [[0, [reduced]]];
                break;

            case 'MPI_Allreduce':

                out = b.map((x, i) => [i, [reduced]]);
                break;

            case 'MPI_Bcast':

                out = b.map((x, i) => [i, [b[0]]]);
                break;

            case 'MPI_Scan':

                out = b.map((x, i) => [
                    i,
                    [calculate(b.slice(0, i + 1), type)]
                ]);

                break;
        }

        $('simOut').innerHTML = `

            <div class="sim-live">

                <span class="live-dot"></span>

                ${esc(op)} · ${b.length} ranks

            </div>

            ${out.map(([i, v]) => `

                <div class="output-row">

                    <b>P${i}</b>

                    <code>${esc(v.join(' · '))}</code>

                </div>

            `).join('')}

        `;

        $('simVisual').innerHTML = b.map((v, i) => {

            const result = out.find(x => x[0] === i);

            return `

                <div class="metric">

                    <div class="eyebrow">
                        ${i === 0 ? 'ROOT PROCESS' : 'WORKER'}
                    </div>

                    <strong>P${i}</strong>

                    <span>INPUT: ${esc(v)}</span>

                    <span>
                        OUTPUT:
                        ${result ? esc(result[1].join(', ')) : '—'}
                    </span>

                </div>

            `;

        }).join('');
    }

    $('sim').onsubmit = e => {
        e.preventDefault();
        run();
    };

    $('op').onchange = run;
    $('reduceType').onchange = run;

    $('randomValues').onclick = () => {

        $('values').value = Array.from(
            { length: 4 },
            () => Math.floor(Math.random() * 90) + 10
        ).join(',');

        run();
    };

    run();
}

// Оқу прогресі

function progress() {

    const n = completedCount();
    const percent = Math.round(n / total * 100);

    view.innerHTML = title(

        t(
            'Оқу прогресі',
            'Прогресс обучения',
            'Learning progress'
        )

    ) + `

        <div class="metric-grid">

            <div class="metric">

                <strong>${total}</strong>

                <span>
                    ${t(
                        'Барлық тапсырма',
                        'Всего задач',
                        'Total exercises'
                    )}
                </span>

            </div>

            <div class="metric">

                <strong>${n}</strong>

                <span>
                    ${t(
                        'Орындалған',
                        'Выполнено',
                        'Completed'
                    )}
                </span>

            </div>

            <div class="metric">

                <strong>${total - n}</strong>

                <span>
                    ${t(
                        'Қалған тапсырма',
                        'Осталось',
                        'Remaining'
                    )}
                </span>

            </div>

            <div class="metric">

                <strong>${percent}%</strong>

                <span>
                    ${t(
                        'Жалпы прогресс',
                        'Общий прогресс',
                        'Overall progress'
                    )}
                </span>

            </div>

        </div>

        <section class="sheet" style="margin-bottom:1rem">

            <h2>${n} / ${total} · ${percent}%</h2>

            <div class="gauge">

                <i style="width:${percent}%"></i>

            </div>

            <p>
                ${t(
                    'Тапсырмаларды орындаған сайын прогресс автоматты түрде сақталады.',
                    'Прогресс автоматически сохраняется после выполнения заданий.',
                    'Progress is automatically saved as exercises are completed.'
                )}
            </p>

            <button id="resetProgress">
                ${t(
                    'Прогресті тазалау',
                    'Сбросить прогресс',
                    'Reset progress'
                )}
            </button>

        </section>

        ${modules()}

    `;

    $('resetProgress').onclick = () => {

        if (confirm(t(
            'Барлық прогресті өшіресіз бе?',
            'Удалить весь прогресс?',
            'Reset all progress?'
        ))) {

            done = {};
            save();
            render();
        }
    };
}

// Мәзір және беттерді ауыстыру

function render() {

    document.documentElement.lang = lang;

    $('edition').textContent = t(
        '3-нұсқа',
        'Вариант 3',
        'Variant 3'
    );

    $('footer-text').textContent = 'MPI Signal PRO · ' + t(
        'Параллельді бағдарламалау',
        'Параллельное программирование',
        'Parallel programming'
    );

    document.querySelectorAll('[data-language]')
        .forEach(b => {

            b.setAttribute(
                'aria-pressed',
                String(b.dataset.language === lang)
            );

        });

    const [page, m, n, tab] = (
        location.hash.slice(1) || 'home'
    ).split('/');

    const menu = [

        ['home', '⌂', t(
            'Басты бет',
            'Главная',
            'Home'
        )],

        ['course', '≡', t(
            'Курс',
            'Курс',
            'Course'
        )],

        ['tools', '↔', t(
            'Симулятор',
            'Симулятор',
            'Simulator'
        )],

        ['progress', '◉', t(
            'Прогресс',
            'Прогресс',
            'Progress'
        )]

    ];

    $('menu').innerHTML = menu.map(([id, glyph, l]) => `

        <a class="dock-link"
           href="#${id}"

           ${
               page === id ||
               (id === 'course' && page === 'module')
               ? 'aria-current="page"'
               : ''
           }>

            <span class="dock-glyph">
                ${glyph}
            </span>

            ${l}

        </a>

    `).join('');

    switch (page) {

        case 'module':
            modulePage(+m, +n, tab);
            break;

        case 'course':
            course();
            break;

        case 'tools':
            tools();
            break;

        case 'progress':
            progress();
            break;

        default:
            home();
    }
}

// Тіл ауыстыру

document.querySelectorAll('[data-language]')
    .forEach(b => {

        b.onclick = () => {

            lang = b.dataset.language;

            try {
                localStorage.setItem('mpiLang', lang);
            } catch {}

            render();
        };
    });

// Беттердің ауысуы

window.addEventListener('hashchange', () => {

    render();
    window.scrollTo(0, 0);

});

// Сайтты іске қосу

render();
// Артқа қайту батырмасы

function addBackButton() {

    const page = location.hash.slice(1) || 'home';

    document.getElementById('backButton')?.remove();

    if (page === 'home') return;

    const button = document.createElement('button');

    button.id = 'backButton';
    button.className = 'back-button';

    button.innerHTML = `
        <span class="back-icon">←</span>
        <span>${t('Артқа қайту', 'Назад', 'Go back')}</span>
    `;

    button.onclick = () => {

        if (page.startsWith('module/')) {
            location.hash = 'course';
        } else {
            location.hash = 'home';
        }

    };

    view.prepend(button);
}

const originalRender = render;

render = function () {
    originalRender();
    addBackButton();
};

render();
// =========================================
// MPI SIGNAL PRO — SPACE 3D ENGINE
// =========================================

(() => {

    // Ғарыштық анимациялық фон

    const canvas = document.createElement('canvas');

    canvas.id = 'spaceBackground';

    canvas.setAttribute('aria-hidden', 'true');

    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    let width;
    let height;
    let stars = [];

    let mouseX = 0;
    let mouseY = 0;

    function resizeSpace() {

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        stars = Array.from(
            { length: width < 760 ? 55 : 130 },
            () => ({

                x: Math.random() * width,

                y: Math.random() * height,

                radius: Math.random() * 1.8 + .3,

                speed: Math.random() * .35 + .08,

                opacity: Math.random() * .7 + .2,

                phase: Math.random() * Math.PI * 2

            })
        );

    }

    function drawSpace(time = 0) {

        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {

            if (!reducedMotion) {

                star.y -= star.speed;

                if (star.y < -5) {

                    star.y = height + 5;

                    star.x = Math.random() * width;

                }

            }

            const glow = reducedMotion

                ? star.opacity

                : star.opacity *
                  (.7 + .3 * Math.sin(
                      time / 1000 + star.phase
                  ));

            ctx.beginPath();

            ctx.arc(
                star.x + mouseX * star.radius,
                star.y + mouseY * star.radius,
                star.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(100,210,255,${glow})`;

            ctx.fill();

        });

        // Жұлдыздар арасындағы байланыстар

        for (let i = 0; i < stars.length; i++) {

            for (let j = i + 1; j < stars.length; j++) {

                const a = stars[i];
                const b = stars[j];

                const dx = a.x - b.x;
                const dy = a.y - b.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < 95) {

                    ctx.beginPath();

                    ctx.moveTo(
                        a.x + mouseX * a.radius,
                        a.y + mouseY * a.radius
                    );

                    ctx.lineTo(
                        b.x + mouseX * b.radius,
                        b.y + mouseY * b.radius
                    );

                    ctx.strokeStyle =
                        `rgba(66,217,255,${
                            .12 * (1 - distance / 95)
                        })`;

                    ctx.lineWidth = .6;

                    ctx.stroke();

                }

            }

        }

        if (!reducedMotion) {

            requestAnimationFrame(drawSpace);

        }

    }

    window.addEventListener('resize', () => {

        resizeSpace();

        if (reducedMotion) {
            drawSpace();
        }

    });

    window.addEventListener('pointermove', e => {

        if (reducedMotion) return;

        mouseX = (e.clientX / width - .5) * 8;

        mouseY = (e.clientY / height - .5) * 8;

    });

    resizeSpace();

    drawSpace();

    // 3D процессорды құрастыру

    function createChip() {

        return `

            <div class="chip-stage">

                <div class="chip-platform">

                    <div class="chip-board"></div>

                    ${Array.from(
                        { length: 8 },
                        (_, i) => `

                            <i class="chip-pin"
                               style="
                                   left:${10 + i * 10}%;
                                   top:-5px;
                                   transform:rotate(90deg);
                               ">
                            </i>

                            <i class="chip-pin"
                               style="
                                   left:${10 + i * 10}%;
                                   bottom:-5px;
                                   transform:rotate(90deg);
                               ">
                            </i>

                            <i class="chip-pin"
                               style="
                                   top:${10 + i * 10}%;
                                   left:-12px;
                               ">
                            </i>

                            <i class="chip-pin"
                               style="
                                   top:${10 + i * 10}%;
                                   right:-12px;
                               ">
                            </i>

                        `
                    ).join('')}

                    <div class="chip-core">

                        <strong>MPI</strong>

                        <small>PARALLEL CORE</small>

                    </div>

                    ${Array.from(
                        { length: 8 },
                        (_, i) => `

                            <i class="chip-particle"
                               style="
                                   left:${
                                       12 + (i % 4) * 24
                                   }%;
                                   top:${
                                       i < 4 ? 12 : 85
                                   }%;
                                   animation-delay:${i * .2}s;
                               ">
                            </i>

                        `
                    ).join('')}

                </div>

                <div class="chip-caption">

                    <span>● MPI CORE MODEL</span>

                    <span>VARIANT 03</span>

                </div>

            </div>

        `;

    }

    // 3D карточкаларды тышқанмен басқару

    function enableSpaceTilt() {

        if (reducedMotion) return;

        document.querySelectorAll(
            '.course-stop, .metric'
        ).forEach(card => {

            card.onpointermove = event => {

                if (event.pointerType !== 'mouse') {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left)
                    / rect.width;

                const y =
                    (event.clientY - rect.top)
                    / rect.height;

                const rx = (y - .5) * -10;

                const ry = (x - .5) * 10;

                card.style.transform = `

                    perspective(1000px)

                    rotateX(${rx}deg)

                    rotateY(${ry}deg)

                    translateY(-5px)

                `;

            };

            card.onpointerleave = () => {

                card.style.transform = '';

            };

        });

    }

    // Ақпараттық жүйе панелі

    function addSystemPanel() {

        const metrics =
            document.querySelector('.metric-grid');

        if (!metrics) return;

        if (document.getElementById('systemPanel')) {
            return;
        }

        const panel = document.createElement('section');

        panel.id = 'systemPanel';

        panel.className = 'system-panel';

        panel.innerHTML = `

            <div class="eyebrow">

                MPI LEARNING SYSTEM / 03

            </div>

            <h2>

                ${t(
                    'Оқу жүйесінің күйі',
                    'Состояние учебной системы',
                    'Learning system status'
                )}

            </h2>

            <div class="system-grid">

                <div class="system-item">

                    <strong>MPI</strong>

                    <span>

                        ${t(
                            'Параллельді бағдарламалау',
                            'Параллельное программирование',
                            'Parallel programming'
                        )}

                    </span>

                </div>

                <div class="system-item">

                    <strong>C++</strong>

                    <span>

                        ${t(
                            'Бағдарламалау тілі',
                            'Язык программирования',
                            'Programming language'
                        )}

                    </span>

                </div>

                <div class="system-item">

                    <strong>${completedCount()} / ${total}</strong>

                    <span>

                        ${t(
                            'Орындалған тапсырмалар',
                            'Выполненные задания',
                            'Completed exercises'
                        )}

                    </span>

                </div>

            </div>

        `;

        metrics.after(panel);

    }

    // Жаңа дизайнды сайтқа қосу

    const previousSpaceRender = render;

    render = function () {

        previousSpaceRender();

        const page =
            location.hash.slice(1) || 'home';

        if (page === 'home') {

            const network =
                document.querySelector('.hero-network');

            if (network) {

                network.outerHTML = createChip();

            }

            addSystemPanel();

        }

        enableSpaceTilt();

    };

    render();

})();