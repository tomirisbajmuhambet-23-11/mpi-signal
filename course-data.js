const mpiSignalCourse = {
    groups: [
        [4, 6],
        [9, 11, 15, 18, 23, 24, 27, 29],
        [48, 50, 55, 57, 59, 63, 65, 67, 69],
        [32, 33, 37, 40, 44, 47, 72, 75, 76, 78, 81],
        [84, 86, 90, 93, 97, 100]
    ],
    demos: [4, 11, 48, 37, 86],
    art: "signal.webp",
    exercises: {
        4: {
            statement: {
                kk: "Жұп рангті жұмысшы процеске бүтін сан, тақ рангті жұмысшыға нақты сан берілген. Әр жұмысшы өз санының екі еселенген мәнін шығарады. 0-ранг деректі өңдемейді және ештеңе шығармайды.",
                en: "Each even worker rank reads an integer, and each odd worker rank reads a real number. Each worker prints twice its own number. The root performs no calculation and prints nothing.",
                ru: "В подчиненных процессах четного ранга ввести целое число, в процессах нечетного ранга ввести вещественное число. В каждом подчиненном процессе вывести удвоенное значение введенного числа. В главном процессе не выполнять никаких действий."
            },
            steps: {
                kk: [
                    "MPI_Init арқылы MPI ортасын іске қос та, MPI_Comm_rank арқылы ағымдағы рангті анықта. Ранг 0 болса, дерек өңдеу бөлігін өткізіп жібер.",
                    "rank % 2 == 0 болса, input мәні int типінде, әйтпесе double типінде алынады. Төрт процестік мысалда 1, 2, 3-рангтерге тиісінше 2.5, 6 және 3.5 берілген.",
                    "Әр жұмысшы өз санын екіге көбейтіп, нәтижесін шығарады: 1-ранг 5, 2-ранг 12, 3-ранг 7. MPI_Finalize функциясын 0-рангты қоса, барлық процесс шақырады."
                ],
                ru: [
                    "Инициализируйте MPI вызовом MPI_Init и определите ранг через MPI_Comm_rank. Для ранга 0 пропустите обработку данных.",
                    "При rank % 2 == 0 значение input берётся с типом int, иначе с типом double. В примере на четырёх процессах ранги 1, 2 и 3 получают 2.5, 6 и 3.5 соответственно.",
                    "Каждый рабочий удваивает число и выводит результат: ранг 1 — 5, ранг 2 — 12, ранг 3 — 7. MPI_Finalize вызывают все процессы, включая ранг 0."
                ],
                en: [
                    "Initialize MPI with MPI_Init and get the current rank with MPI_Comm_rank. Skip the data-processing branch on rank 0.",
                    "When rank % 2 == 0, use int for input. Otherwise use double. In the four-process example, ranks 1, 2, and 3 use 2.5, 6, and 3.5.",
                    "Each worker doubles and prints its number: rank 1 prints 5, rank 2 prints 12, and rank 3 prints 7. Every process calls MPI_Finalize, including rank 0."
                ]
            },
            expected: "rank 1: 5\nrank 2: 12\nrank 3: 7",
            np: 4,
            source: `// MPIBegin4 — Workers double a number of the type selected by their rank.
#include <mpi.h>
#include <iostream>
#include <sstream>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    // Rank 0 participates in MPI initialization and finalization only.
    if (rank != 0) {
        std::ostringstream line;
        line << "rank " << rank << ": ";
        if (rank % 2 == 0) {
            const int input = 4 + rank; // Example integer at this even rank.
            line << 2LL * input;
        } else {
            const double input = 2.0 + rank / 2.0; // Example real at this odd rank.
            line << 2.0 * input;
        }
        std::cout << line.str() << std::endl;
    }

    MPI_Finalize();
    return 0;
}
`,
            original: "В подчиненных процессах четного ранга ввести целое число, в процессах нечетного ранга ввести вещественное число. В каждом подчиненном процессе вывести удвоенное значение введенного числа. В главном процессе не выполнять никаких действий."
        },
        6: {
            statement: {
                kk: "Әр процесте N > 0 және N саннан тұратын тізім берілген. 0-ранг өз сандарының көбейтіндісін, жұп рангті жұмысшылар қосындысын, ал тақ рангті жұмысшылар арифметикалық ортасын шығарады.",
                en: "Each process has N > 0 and a list of N numbers. The root prints the product of its numbers. Even worker ranks print their sum, and odd worker ranks print their arithmetic mean.",
                ru: "В каждом процессе дано целое число N (> 0) и набор из N чисел. В подчиненных процессах четного ранга вывести сумму чисел из данного набора, в процессах нечетного ранга вывести среднее арифметическое чисел из данного набора, в главном процессе вывести произведение чисел из данного набора."
            },
            steps: {
                kk: [
                    "Бастапқы inputByRank деректерінің r-жолы r-рангке тиесілі. Жолдардың ұзындығы әртүрлі болуы мүмкін. Төрт рангке [2, 3, 4], [3, 6], [4, 7, 10], [5, 8, 11, 16] берілген.",
                    "Алдымен rank == 0 шартын тексер. Түбір std::accumulate функциясын көбейту амалымен және бастапқы 1.0 мәнімен шақырады: 2 × 3 × 4 = 24.",
                    "Жұмысшылар std::accumulate арқылы қосынды табады. Жұп ранг оны тікелей шығарады: 4 + 7 + 10 = 21. Тақ ранг қосындыны өз тізімінің ұзындығына бөледі: 9 / 2 = 4.5 және 40 / 4 = 10."
                ],
                ru: [
                    "Строка r в inputByRank принадлежит рангу r. Длины строк могут отличаться. Четыре ранга получают [2, 3, 4], [3, 6], [4, 7, 10] и [5, 8, 11, 16].",
                    "Сначала проверьте rank == 0. Корень вызывает std::accumulate с умножением и начальным значением 1.0: 2 × 3 × 4 = 24.",
                    "Рабочие находят сумму через std::accumulate. Чётный выводит сумму 4 + 7 + 10 = 21. Нечётные делят сумму на длину своей строки: 9 / 2 = 4.5 и 40 / 4 = 10."
                ],
                en: [
                    "Row r of inputByRank belongs to rank r. The rows can have different lengths. The four ranks get [2, 3, 4], [3, 6], [4, 7, 10], and [5, 8, 11, 16].",
                    "Check rank == 0 first. The root calls std::accumulate with multiplication and an initial value of 1.0: 2 × 3 × 4 = 24.",
                    "Workers sum their own lists with std::accumulate. The even worker prints 4 + 7 + 10 = 21. The odd workers divide their sums by their own list lengths: 9 / 2 = 4.5 and 40 / 4 = 10."
                ]
            },
            expected: "rank 0: 24\nrank 1: 4.5\nrank 2: 21\nrank 3: 10",
            np: 4,
            source: `// MPIBegin6 — Rank 0 prints a product; other ranks print a sum or mean.
#include <mpi.h>
#include <algorithm>
#include <functional>
#include <iostream>
#include <numeric>
#include <sstream>
#include <vector>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Example input: row r is the nonempty list assigned to rank r.
    const std::vector<std::vector<double>> inputByRank{
        {2, 3, 4}, {3, 6}, {4, 7, 10}, {5, 8, 11, 16}
    };
    const bool hasEmptyRow = std::any_of(inputByRank.begin(), inputByRank.end(),
                                         [](const auto& row) { return row.empty(); });
    if (size != static_cast<int>(inputByRank.size()) || hasEmptyRow) {
        if (rank == 0) std::cerr << "Set one nonempty input row per process." << std::endl;
        MPI_Finalize();
        return 1;
    }

    const auto& values = inputByRank[rank];
    double result = 0.0;
    if (rank == 0) {
        result = std::accumulate(values.begin(), values.end(), 1.0, std::multiplies<double>{});
    } else {
        const double sum = std::accumulate(values.begin(), values.end(), 0.0);
        result = rank % 2 == 0 ? sum : sum / values.size();
    }
    std::ostringstream line;
    line << "rank " << rank << ": " << result;
    std::cout << line.str() << std::endl;

    MPI_Finalize();
    return 0;
}
`,
            original: "В каждом процессе дано целое число N (> 0) и набор из N чисел. В подчиненных процессах четного ранга вывести сумму чисел из данного набора, в процессах нечетного ранга вывести среднее арифметическое чисел из данного набора, в главном процессе вывести произведение чисел из данного набора."
        }
    },
    theory: {
        1: {
            kk: {
                definitions: [
                    ["Процесс", "Іске қосылған бағдарламаның дербес данасы. MPI бағдарламасында бірдей орындалатын файл бірнеше рет іске қосылады, әр процестің өз айнымалылары мен жеке жады болады."],
                    ["SPMD", "Бір бағдарлама, бірнеше дерек қағидасы. Барлық процесс бір кодқа кіреді, бірақ rank секілді шарттарға қарай әртүрлі дерек өңдейді немесе әртүрлі тармақпен жүреді."],
                    ["MPI_Init және MPI_Finalize", "MPI_Init байланыс ортасын іске қосады. MPI_Finalize оны аяқтайды. Осы екі шақырудың арасында MPI_COMM_WORLD ішінде ранг пен процесс санын сұраймыз."],
                    ["MPI_COMM_WORLD", "Бағдарлама басында қолжетімді, іске қосылған процестердің барлығын қамтитын коммуникатор."],
                    ["Ранг және өлшем", "MPI_Comm_rank осы коммуникатордағы 0-ден басталатын рангті береді. MPI_Comm_size коммуникатордағы процесс санын береді. Төрт процесте өлшем 4, ал рангтер 0, 1, 2, 3."],
                    ["Жергілікті өңдеу", "Процесс өз массивінен қосынды, орташа немесе көбейтінді есептей алады. MPIBegin6-да ранг 0 көбейтіндіге, жұп жұмысшылар қосындыға, тақ жұмысшылар орташаға жауап береді."]
                ],
                pitfalls: [
                    "Ранг 0 шартын жұп пен таққа бөлуден бұрын тексер. MPIBegin4-те ол есеп жүргізбейді, MPIBegin6-да көбейтінді шығарады.",
                    "Қосындыны 0-ден, көбейтіндіні 1-ден баста. Орташа үшін N > 0 болсын және нақты бөлу қолдан.",
                    "MPI_Init пен MPI_Finalize барлық процесте орындалады, тіпті ранг 0 тапсырма дерегін өңдемесе де."
                ],
                example: [
                    "MPIBegin4 үшін төрт процесс алайық. 1-рангке 1.25, 2-рангке −3, 3-рангке 2.75 берейік. Тиісінше 2.5, −6 және 5.5 шығады. Түбірлік 0-ранг сан оқымайды және мән шығармайды.",
                    "MPIBegin6 үшін төрт рангтің массивтері ретімен [2, 3, 4], [1, 2, 6], [3, 7], [2, 3, 9] болсын. 0-ранг: 2 × 3 × 4 = 24. 1-ранг: 9 / 3 = 3. 2-ранг: 3 + 7 = 10. 3-ранг: 14 / 3 ≈ 4.667.",
                    "Екі есепте де есептеулер жергілікті орындалады. Шығару жолдары араласса, нәтижені әр жолдағы ранг нөмірімен сәйкестендір."
                ]
            },
            ru: {
                definitions: [
                    ["Процесс", "Самостоятельный экземпляр запущенной программы. MPI запускает один исполняемый файл несколько раз, и каждый процесс хранит свои переменные в отдельной памяти."],
                    ["SPMD", "Одна программа, разные данные. Все процессы входят в один код, но могут обработать разные данные или выбрать разные ветви в зависимости от ранга."],
                    ["MPI_Init и MPI_Finalize", "MPI_Init запускает среду обмена сообщениями, MPI_Finalize завершает работу с ней. Ранг и размер MPI_COMM_WORLD запрашивают между этими вызовами."],
                    ["MPI_COMM_WORLD", "Коммуникатор, доступный при запуске и объединяющий все запущенные процессы программы."],
                    ["Ранг и размер", "MPI_Comm_rank возвращает номер процесса внутри коммуникатора, начиная с 0. MPI_Comm_size возвращает количество процессов. Для четырёх процессов размер равен 4, а ранги равны 0, 1, 2 и 3."],
                    ["Локальная обработка", "Процесс вычисляет сумму, среднее или произведение по собственному массиву. В MPIBegin6 ранг 0 считает произведение, чётные рабочие ранги — сумму, нечётные — среднее."]
                ],
                pitfalls: [
                    "Обрабатывайте ранг 0 до ветвления по чётности. В MPIBegin4 он пропускает вычисление, а в MPIBegin6 вычисляет произведение.",
                    "Начинайте сумму с 0, произведение с 1. Для среднего N должно быть больше 0, а деление — вещественным.",
                    "Вызывайте MPI_Init и MPI_Finalize во всех процессах, даже если ранг 0 пропускает обработку данных задачи."
                ],
                example: [
                    "Для MPIBegin4 запустим четыре процесса. На рангах 1, 2 и 3 зададим 1.25, −3 и 2.75. Они выведут соответственно 2.5, −6 и 5.5. Корневой ранг 0 не читает число и не выводит значение.",
                    "Для MPIBegin6 возьмём массивы [2, 3, 4], [1, 2, 6], [3, 7], [2, 3, 9] по рангам. Ранг 0: 2 × 3 × 4 = 24. Ранг 1: 9 / 3 = 3. Ранг 2: 3 + 7 = 10. Ранг 3: 14 / 3 ≈ 4.667.",
                    "Оба вычисления выполняются локально. Если строки перемешались, сверяйте результат с номером ранга в каждой строке."
                ]
            },
            en: {
                definitions: [
                    ["Process", "An independent instance of a running program. MPI launches an executable multiple times, with each process keeping its own variables in separate memory."],
                    ["SPMD", "Single program, multiple data. Processes enter the same code and may handle different data or choose different branches based on rank."],
                    ["MPI_Init and MPI_Finalize", "MPI_Init starts the message-passing environment. MPI_Finalize shuts it down. Query rank and size in MPI_COMM_WORLD between these calls."],
                    ["MPI_COMM_WORLD", "The communicator available at startup containing every process launched for the program."],
                    ["Rank and size", "MPI_Comm_rank returns a process's zero-based index in the communicator. MPI_Comm_size returns the process count. Four processes have size 4 and ranks 0, 1, 2, and 3."],
                    ["Local computation", "A process computes a sum, mean, or product of its own array. In MPIBegin6, rank 0 computes the product, even workers compute sums, and odd workers compute means."]
                ],
                pitfalls: [
                    "Handle rank 0 before branching by parity. It skips the computation in MPIBegin4 and computes a product in MPIBegin6.",
                    "Start a sum at 0 and a product at 1. A mean requires N > 0 and real-valued division.",
                    "Call MPI_Init and MPI_Finalize on every process, even if rank 0 skips the exercise's data processing."
                ],
                example: [
                    "Run MPIBegin4 on four processes. Give ranks 1, 2, and 3 the values 1.25, −3, and 2.75. They print 2.5, −6, and 5.5, respectively. Root rank 0 reads no number and produces no value.",
                    "For MPIBegin6 use the arrays [2, 3, 4], [1, 2, 6], [3, 7], and [2, 3, 9] in rank order. Rank 0: 2 × 3 × 4 = 24. Rank 1: 9 / 3 = 3. Rank 2: 3 + 7 = 10. Rank 3: 14 / 3 ≈ 4.667.",
                    "Both programs perform local calculations. If console lines arrive out of order, check each result using its rank label."
                ]
            }
        }
    },
    examples: {}
};
Object.assign(mpiSignalCourse.exercises, {
    9: {
        statement: {
            kk: "Әр жұмысшыда төрт бүтін сан бар. Әр жұмысшы осы төрт санды түбірге бір MPI_Send шақыруымен жібереді. Түбір алынған төрттіктерді жіберуші рангінің өсу ретімен шығарады.",
            ru: "В каждом подчиненном процессе даны четыре целых числа. Переслать эти числа в главный процесс, используя по одному вызову функции MPI_Send для каждого передающего процесса, и вывести их в главном процессе. Полученные числа выводить в порядке возрастания рангов переславших их процессов.",
            en: "Each worker has four integers. Send all four to the root using one MPI_Send call per worker. At the root, print the received sequences in ascending sender-rank order."
        },
        steps: {
            kk: [
                "Әр жұмысшы төрт бүтін саннан тұратын values массивін құрады. Мысалда r-рангтің мәндері 100*r + 1-ден 100*r + 4-ке дейін.",
                "Жұмысшы MPI_Send функциясын бір рет, count=4, datatype=MPI_INT, dest=0 және tag=9 параметрлерімен шақырады.",
                "Түбір source=1-ден бастап әр рангтен MPI_Recv арқылы төрт сан қабылдайды. Сондықтан 1-рангтің 101–104 сандары 2-рангтің 201–204 сандарынан бұрын жазылады."
            ],
            ru: [
                "Каждый рабочий формирует массив values из четырёх целых. В примере ранг r получает значения от 100*r + 1 до 100*r + 4.",
                "Рабочий вызывает MPI_Send один раз с count=4, datatype=MPI_INT, dest=0 и tag=9.",
                "Корень вызывает MPI_Recv по очереди для рангов начиная с 1. Поэтому числа 101–104 от ранга 1 выводятся перед числами 201–204 от ранга 2."
            ],
            en: [
                "Each worker builds a four-integer values array. Rank r uses values from 100*r + 1 to 100*r + 4 in the example.",
                "The worker calls MPI_Send once with count=4, datatype=MPI_INT, dest=0, and tag=9.",
                "The root receives from each sender in rank order starting at 1. Therefore the values 101–104 from rank 1 print before 201–204 from rank 2."
            ]
        },
        expected: "from 1: 101 102 103 104\nfrom 2: 201 202 203 204\nfrom 3: 301 302 303 304",
        np: 4,
        source: `// MPIBegin9 — Each worker sends four integers in a single message.
#include <mpi.h>
#include <array>
#include <iostream>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    constexpr int count = 4;
    constexpr int tag = 9;
    if (rank == 0) {
        for (int source = 1; source < size; ++source) {
            std::array<int, count> values;
            MPI_Recv(values.data(), count, MPI_INT, source, tag,
                     MPI_COMM_WORLD, MPI_STATUS_IGNORE);

            std::cout << "from " << source << ":";
            for (int value : values) std::cout << ' ' << value;
            std::cout << std::endl;
        }
    } else {
        // Example input: replace the four values with your own integers.
        const int base = rank * 100;
        const std::array<int, count> values{base + 1, base + 2, base + 3, base + 4};
        MPI_Send(values.data(), count, MPI_INT, 0, tag, MPI_COMM_WORLD);
    }

    MPI_Finalize();
    return 0;
}
`,
        original: "В каждом подчиненном процессе даны четыре целых числа. Переслать эти числа в главный процесс, используя по одному вызову функции MPI_Send для каждого передающего процесса, и вывести их в главном процессе. Полученные числа выводить в порядке возрастания рангов переславших их процессов."
    },
    11: {
        statement: {
            kk: "Түбірде жұмысшылар санына тең нақты сандар тізімі берілген. MPI_Send көмегімен бірінші санды 1-рангке, екіншісін 2-рангке және осылай жалғастырып, әр жұмысшыға бір сан жібер. Жұмысшылар алған санын шығарады.",
            ru: "В главном процессе дан набор вещественных чисел; количество чисел равно количеству подчиненных процессов. С помощью функции MPI_Send переслать по одному числу в каждый из подчиненных процессов (первое число в процесс 1, второе — в процесс 2, и т. д.) и вывести в подчиненных процессах полученные числа.",
            en: "The root has one real number per worker. Use MPI_Send to send the first number to rank 1, the second to rank 2, and so on. Each worker prints the number it receives."
        },
        steps: {
            kk: [
                "Мысал input тізімі [1.5, −2.25, 9] болғандықтан, түбірге қоса үш жұмысшы қажет. Тізімнің ұзындығы size − 1 болуы керек.",
                "Түбір target мәнін 1-ден size − 1-ге дейін арттырады. Әр MPI_Send шақыруында input[target − 1] мәнін MPI_DOUBLE типімен бір элемент ретінде жібереді.",
                "Жұмысшы 0-рангтен сәйкес тип және tag арқылы қабылдайды. Осылайша 1-ранг 1.5, 2-ранг −2.25, 3-ранг 9 алады."
            ],
            ru: [
                "В примере input содержит [1.5, −2.25, 9], поэтому нужны главный процесс и три рабочих. Длина input должна равняться size − 1.",
                "Корень перебирает target от 1 до size − 1. Каждый вызов MPI_Send передаёт один элемент input[target − 1] с типом MPI_DOUBLE.",
                "Рабочий принимает от ранга 0 с совпадающим типом и тегом. Ранг 1 получает 1.5, ранг 2 — −2.25, ранг 3 — 9."
            ],
            en: [
                "The example input is [1.5, −2.25, 9], so run the root with three workers. The input length must equal size − 1.",
                "The root iterates target from 1 through size − 1. Each MPI_Send call sends one input[target − 1] using MPI_DOUBLE.",
                "Each worker receives from rank 0 with the matching type and tag. Ranks 1, 2, and 3 receive 1.5, −2.25, and 9 respectively."
            ]
        },
        expected: "rank 1: 1.5\nrank 2: -2.25\nrank 3: 9",
        np: 4,
        source: `// MPIBegin11 — The root sends one real number to each worker.
#include <mpi.h>
#include <iostream>
#include <sstream>
#include <vector>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Example input at the root. The number of items must equal size - 1.
    const std::vector<double> input{1.5, -2.25, 9.0};
    if (size - 1 != static_cast<int>(input.size())) {
        if (rank == 0) std::cerr << "Set one value per worker, excluding the root." << std::endl;
        MPI_Finalize();
        return 1;
    }

    constexpr int tag = 11;
    if (rank == 0) {
        for (int target = 1; target < size; ++target) {
            MPI_Send(&input[target - 1], 1, MPI_DOUBLE, target, tag, MPI_COMM_WORLD);
        }
    } else {
        double value = 0.0;
        MPI_Recv(&value, 1, MPI_DOUBLE, 0, tag, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        std::ostringstream line;
        line << "rank " << rank << ": " << value;
        std::cout << line.str() << std::endl;
    }

    MPI_Finalize();
    return 0;
}
`,
        original: "В главном процессе дан набор вещественных чисел; количество чисел равно количеству подчиненных процессов. С помощью функции MPI_Send переслать по одному числу в каждый из подчиненных процессов (первое число в процесс 1, второе — в процесс 2, и т. д.) и вывести в подчиненных процессах полученные числа."
    },
    15: {
        statement: {
            kk: "Әр жұмысшыда N бүтін саны берілген: тек біреуінде N > 0, қалғандарында N = 0. N > 0 жұмысшыда N саннан тұратын тізім бар. Түбірге тізімді жібер, қабылдауда MPI_ANY_SOURCE пайдалан және алынған сандарды жіберуші рангпен бірге шығар.",
            ru: "В каждом подчиненном процессе дано целое число N, причем для одного процесса это число больше нуля, а для остальных равно нулю. В процессе с ненулевым N дан также набор из N чисел. Переслать данный набор чисел в главный процесс и вывести в главном процессе полученные числа и ранг процесса, переславшего этот набор. При приеме сообщения использовать параметр MPI_ANY_SOURCE.",
            en: "Each worker has an integer N. Exactly one worker has N > 0 and a list of N numbers; every other worker has N = 0. Send the list to the root, receive with MPI_ANY_SOURCE, and print the values and the sender's rank."
        },
        steps: {
            kk: [
                "Мысалдағы inputByWorker тізімінде 2-рангте ғана [7.5, −3, 2.25] бар. 1 және 3-рангтердің тізімдері бос. Тек N > 0 жұмысшы MPI_Send шақырады.",
                "0-ранг MPI_Probe(MPI_ANY_SOURCE, ...) арқылы хабарды әлі қабылдамай тексереді. MPI_Get_count нақты элемент санын береді. Осы өлшеммен қабылдау векторын құр.",
                "MPI_Recv шақыруында MPI_ANY_SOURCE қолдан. Есеп бойынша бір ғана жіберуші бар, сондықтан осы қабылдау тексерілген хабарды алады. Соңғы status.MPI_SOURCE мәні 2, ал алынған тізім [7.5, −3, 2.25]."
            ],
            ru: [
                "В примере inputByWorker только ранг 2 содержит [7.5, −3, 2.25]. Списки рангов 1 и 3 пусты. Только рабочий с N > 0 вызывает MPI_Send.",
                "Ранг 0 проверяет сообщение без извлечения через MPI_Probe(MPI_ANY_SOURCE, ...). MPI_Get_count возвращает число элементов, по которому выделяется вектор.",
                "В MPI_Recv укажите MPI_ANY_SOURCE. Отправитель всего один, поэтому приём соответствует проверенному сообщению. В status.MPI_SOURCE получится 2, а в векторе [7.5, −3, 2.25]."
            ],
            en: [
                "In inputByWorker only rank 2 has [7.5, −3, 2.25]. Ranks 1 and 3 have empty lists. Only the worker with N > 0 calls MPI_Send.",
                "Rank 0 uses MPI_Probe(MPI_ANY_SOURCE, ...) to inspect the message without consuming it. MPI_Get_count supplies the number of elements for the receive vector.",
                "Use MPI_ANY_SOURCE in MPI_Recv. With only one sender, this call matches the probed message. The resulting status.MPI_SOURCE is 2, and the received values are [7.5, −3, 2.25]."
            ]
        },
        expected: "from 2: 7.5 -3 2.25",
        np: 4,
        source: `// MPIBegin15 — Find the only worker with a nonempty list.
#include <mpi.h>
#include <algorithm>
#include <iostream>
#include <vector>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Example input for worker ranks 1, 2, 3. Exactly one list must be nonempty.
    const std::vector<std::vector<double>> inputByWorker{{}, {7.5, -3.0, 2.25}, {}};
    const int nonemptyCount = static_cast<int>(std::count_if(
        inputByWorker.begin(), inputByWorker.end(), [](const auto& row) { return !row.empty(); }
    ));
    if (size - 1 != static_cast<int>(inputByWorker.size()) || nonemptyCount != 1) {
        if (rank == 0) std::cerr << "Set one row per worker and exactly one nonempty row." << std::endl;
        MPI_Finalize();
        return 1;
    }

    constexpr int tag = 15;
    if (rank == 0) {
        MPI_Status status;
        MPI_Probe(MPI_ANY_SOURCE, tag, MPI_COMM_WORLD, &status);
        int count = 0;
        MPI_Get_count(&status, MPI_DOUBLE, &count);
        std::vector<double> values(count);

        // Only one worker sends this tag, so a wildcard receive matches the probed message.
        MPI_Recv(values.data(), count, MPI_DOUBLE, MPI_ANY_SOURCE, tag,
                 MPI_COMM_WORLD, &status);
        std::cout << "from " << status.MPI_SOURCE << ":";
        for (double value : values) std::cout << ' ' << value;
        std::cout << std::endl;
    } else {
        const auto& values = inputByWorker[rank - 1];
        if (!values.empty()) {
            MPI_Send(values.data(), static_cast<int>(values.size()), MPI_DOUBLE,
                     0, tag, MPI_COMM_WORLD);
        }
    }

    MPI_Finalize();
    return 0;
}
`,
        original: "В каждом подчиненном процессе дано целое число N, причем для одного процесса это число больше нуля, а для остальных равно нулю. В процессе с ненулевым N дан также набор из N чисел. Переслать данный набор чисел в главный процесс и вывести в главном процессе полученные числа и ранг процесса, переславшего этот набор. При приеме сообщения использовать параметр MPI_ANY_SOURCE."
    },
    18: {
        statement: {
            kk: "Әр процесте бүтін сан бар. MPI_Send және MPI_Recv арқылы санды келесі рангке жіберіп, сақина бойымен бір позицияға жылжыт. Соңғы ранг 0-ге жібереді. Әр ранг қабылдаған мәнін шығарады.",
            ru: "Каждый процесс имеет целое число. С помощью MPI_Send и MPI_Recv выполните циклический сдвиг на одну позицию. Последний ранг отправляет рангу 0. Каждый ранг выводит принятое число.",
            en: "Every process has an integer. Use MPI_Send and MPI_Recv to shift each number to the next rank in a ring, wrapping the last rank to rank 0. Each rank prints the value it receives."
        },
        steps: {
            kk: [
                "Дерек мысалы value жолында орнатылған. Төрт рангте [10, 20, 30, 40] беріледі. K процесс үшін келесі ранг (rank + 1) % K, ал алдыңғысы (rank − 1 + K) % K.",
                "0-ранг алдымен жібереді, кейін қабылдайды. Қалған рангтер алдымен қабылдап, кейін өздерінің бастапқы мәнін жібереді. Осы реттілік барлық рангтің бір уақытта жіберуді күтуіне жол бермейді.",
                "0-ранг 40 алады, қалғандары 10, 20, 30 алады. Жалғыз процесс болғанда нәтиже оның өзінің мәніне тең."
            ],
            ru: [
                "Начальные числа заданы в строке value. Для четырёх рангов это [10, 20, 30, 40]. При K процессах следующий ранг равен (rank + 1) % K, предыдущий — (rank − 1 + K) % K.",
                "Ранг 0 сначала отправляет, затем принимает. Остальные сначала принимают, затем отправляют своё исходное значение. Такой порядок исключает замкнутое ожидание отправок.",
                "Ранг 0 получает 40, остальные — 10, 20 и 30. При одном процессе сдвиг оставляет число на месте."
            ],
            en: [
                "The value declaration supplies [10, 20, 30, 40] for four ranks. With K processes, the next rank is (rank + 1) % K and the previous rank is (rank − 1 + K) % K.",
                "Rank 0 sends before receiving. Every other rank receives first and then sends its own original value. This ordering avoids a circular wait on sends.",
                "Rank 0 gets 40, and the remaining ranks get 10, 20, and 30. With one process, the shift leaves its value in place."
            ]
        },
        expected: "rank 0: 40\nrank 1: 10\nrank 2: 20\nrank 3: 30",
        np: 4,
        source: `// MPIBegin18 — A one-position cyclic shift using MPI_Send and MPI_Recv.
#include <mpi.h>
#include <iostream>
#include <sstream>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    const int value = 10 * (rank + 1); // Example input on this rank.
    int received = value;
    constexpr int tag = 18;

    if (size > 1) {
        const int next = (rank + 1) % size;
        const int previous = (rank - 1 + size) % size;

        // Rank 0 starts the chain. Every other rank waits before forwarding.
        if (rank == 0) {
            MPI_Send(&value, 1, MPI_INT, next, tag, MPI_COMM_WORLD);
            MPI_Recv(&received, 1, MPI_INT, previous, tag, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        } else {
            MPI_Recv(&received, 1, MPI_INT, previous, tag, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
            MPI_Send(&value, 1, MPI_INT, next, tag, MPI_COMM_WORLD);
        }
    }

    std::ostringstream line;
    line << "rank " << rank << ": " << received;
    std::cout << line.str() << std::endl;

    MPI_Finalize();
    return 0;
}
`,
        original: "В каждом процессе дано целое число. С помощью функций MPI_Send и MPI_Recv осуществить для всех процессов циклический сдвиг данных с шагом 1, переслав число из процесса 0 в процесс 1, из процесса 1 в процесс 2, …, из последнего процесса в процесс 0. В каждом процессе вывести полученное число."
    },
    23: {
        statement: {
            kk: "K процестің әрқайсысында K − 1 бүтін сан берілген. Әр процесс өзінен басқа әр қабылдаушыға рангтерінің өсу ретімен тізімнен бір сан жібереді. Әр процесс алынған сандарды жіберуші рангінің ретімен шығарады.",
            ru: "У каждого из K процессов есть K − 1 целое число. Каждый процесс посылает по одному элементу всем остальным, перебирая получателей по возрастанию ранга. Принятые числа выводятся в порядке рангов отправителей.",
            en: "Each of K processes holds K − 1 integers. Each process sends one number to each other rank in ascending destination order and prints received numbers in ascending sender order."
        },
        steps: {
            kk: [
                "Әр ранг өзінен басқалардың рангтерін өсу ретімен peers тізіміне жинайды. outgoing[i] сол тізімдегі peers[i] адресатына тиесілі. Мысалда P0-дің [1, 2, 3] мәндері P1, P2, P3-ке бөлінеді.",
                "Алдымен әр жіберушіге MPI_Irecv тірке. Кейін әр қабылдаушыға MPI_Isend жібер. MPI_Waitall біткенше жіберу буферін өзгертпе және қабылдау буферін оқыма.",
                "incoming массиві peers ретімен толтырылғандықтан, басып шығару үшін қайта сұрыптау қажет емес. Мысалы, P0-де P1, P2 және P3-тен [11, 21, 31] шығады."
            ],
            ru: [
                "Создайте список peers по возрастанию, исключив свой ранг. Элемент outgoing[i] предназначен peers[i]. Например, P0 распределяет [1, 2, 3] по P1, P2 и P3.",
                "Сначала разместите MPI_Irecv для каждого источника, затем MPI_Isend для каждого получателя. До завершения MPI_Waitall не изменяйте буфер отправки и не читайте буфер приёма.",
                "incoming заполняется по порядку peers, поэтому сортировка не нужна. P0 получает от P1, P2 и P3 ряд [11, 21, 31]."
            ],
            en: [
                "Create a sorted peers list that excludes the local rank. Each outgoing[i] goes to peers[i]. For example, P0 sends [1, 2, 3] to P1, P2, and P3 respectively.",
                "Post MPI_Irecv for each source, then MPI_Isend for each destination. Do not change outgoing or read incoming until MPI_Waitall completes.",
                "The incoming buffer uses peers order, so no output sort is needed. For example, P0 receives [11, 21, 31] from P1, P2, and P3."
            ]
        },
        expected: "rank 0: 11 21 31\nrank 1: 1 22 32\nrank 2: 2 12 33\nrank 3: 3 13 23",
        np: 4,
        source: `// MPIBegin23 — Send one distinct item to every other rank.
#include <mpi.h>
#include <iostream>
#include <sstream>
#include <vector>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    const int peerCount = size - 1;
    std::vector<int> peers;
    for (int peer = 0; peer < size; ++peer) {
        if (peer != rank) peers.push_back(peer);
    }

    // Example input: item i goes to peer i in ascending rank order.
    std::vector<int> outgoing(peerCount), incoming(peerCount);
    for (int i = 0; i < peerCount; ++i) outgoing[i] = 10 * rank + i + 1;

    constexpr int tag = 23;
    std::vector<MPI_Request> requests(2 * peerCount);
    for (int i = 0; i < peerCount; ++i) {
        MPI_Irecv(&incoming[i], 1, MPI_INT, peers[i], tag, MPI_COMM_WORLD, &requests[i]);
    }
    for (int i = 0; i < peerCount; ++i) {
        MPI_Isend(&outgoing[i], 1, MPI_INT, peers[i], tag, MPI_COMM_WORLD, &requests[peerCount + i]);
    }
    MPI_Waitall(static_cast<int>(requests.size()), requests.data(), MPI_STATUSES_IGNORE);

    std::ostringstream line;
    line << "rank " << rank << ":";
    for (int value : incoming) line << ' ' << value;
    std::cout << line.str() << std::endl;

    MPI_Finalize();
    return 0;
}
`,
        original: "В каждом процессе дан набор из K − 1 целого числа, где K — количество процессов. Для каждого процесса переслать по одному из данных в нем чисел в остальные процессы, перебирая ранги процессовполучателей в возрастающем порядке, и вывести полученные числа в порядке возрастания рангов переславших их процессов."
    },
    24: {
        statement: {
            kk: "Процестер саны жұп. Әр рангте 1–4 сан бар. MPI_Sendrecv арқылы 0 мен 1, 2 мен 3 және келесі жұптар арасында тізімдерді алмастыр. Әр процесс алған тізімін шығарады.",
            ru: "Число процессов чётное. У каждого ранга 1–4 числа. Через MPI_Sendrecv обменяйте наборы в парах 0 и 1, 2 и 3 и так далее. Каждый процесс выводит полученный набор.",
            en: "The process count is even. Each rank has 1–4 numbers. Use MPI_Sendrecv to exchange lists within the pairs (0, 1), (2, 3), and so on. Each process prints its received list."
        },
        steps: {
            kk: [
                "Жұп рангке серігі rank + 1, тақ рангке rank − 1. Мысалда тізімнің ұзындығы rank % 4 + 1. r-рангтің i-ші мәні 10*r + 0.5*(i+1), мұнда i нөлден басталады.",
                "MPI_Sendrecv арқылы жіберу мен қабылдауды бір шақыруға біріктір. Серіктің тізімі ұзындау болуы мүмкін, сондықтан қабылдау буфері төрт мәнге жетеді.",
                "MPI_Get_count нақты ұзындықты береді. P0 P1-ден [10.5, 11], ал P1 P0-ден [0.5] алады. Екінші жұп та дәл солай алмасады."
            ],
            ru: [
                "У чётного ранга партнёр rank + 1, у нечётного — rank − 1. В примере длина равна rank % 4 + 1, а значение с индексом i равно 10*rank + 0.5*(i+1).",
                "Объедините отправку и приём в одном вызове MPI_Sendrecv. Полученный набор может быть длиннее исходного, поэтому выделите четыре ячейки.",
                "Определите реальную длину через MPI_Get_count. P0 получает от P1 [10.5, 11], а P1 от P0 — [0.5]. Вторая пара обменивается таким же способом."
            ],
            en: [
                "Even ranks partner with rank + 1 and odd ranks with rank − 1. In the sample the list length is rank % 4 + 1 and item i is 10*rank + 0.5*(i+1).",
                "Use MPI_Sendrecv to combine send and receive in one call. The received list may be longer than the local list, so reserve room for four numbers.",
                "Use MPI_Get_count to find the actual received length. P0 gets [10.5, 11] from P1, while P1 gets [0.5] from P0. The second pair exchanges lists the same way."
            ]
        },
        expected: "rank 0: 10.5 11\nrank 1: 0.5\nrank 2: 30.5 31 31.5 32\nrank 3: 20.5 21 21.5",
        np: 4,
        source: `// MPIBegin24 — Neighboring pairs exchange lists of different lengths.
#include <mpi.h>
#include <iostream>
#include <sstream>
#include <vector>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    if (size % 2 != 0) {
        if (rank == 0) std::cerr << "Use an even number of processes." << std::endl;
        MPI_Finalize();
        return 1;
    }

    constexpr int tag = 24;
    constexpr int maxCount = 4;
    const int partner = rank % 2 == 0 ? rank + 1 : rank - 1;

    // Example input: 1..4 real numbers on each rank.
    const int count = rank % maxCount + 1;
    std::vector<double> values(count);
    for (int i = 0; i < count; ++i) values[i] = 10.0 * rank + 0.5 * (i + 1);

    double received[maxCount];
    MPI_Status status;
    MPI_Sendrecv(values.data(), count, MPI_DOUBLE, partner, tag,
                 received, maxCount, MPI_DOUBLE, partner, tag,
                 MPI_COMM_WORLD, &status);
    int length = 0;
    MPI_Get_count(&status, MPI_DOUBLE, &length);

    std::ostringstream line;
    line << "rank " << rank << ":";
    for (int i = 0; i < length; ++i) line << ' ' << received[i];
    std::cout << line.str() << std::endl;

    MPI_Finalize();
    return 0;
}
`,
        original: "Количество процессов — четное число. В каждом процессе дано целое число N (0 < N < 5) и набор из N чисел. С помощью функции MPI_Sendrecv выполнить обмен исходными наборами между парами процессов 0 и 1, 2 и 3, и т. д. В каждом процессе вывести полученный набор чисел."
    },
    27: {
        statement: {
            kk: "Әр жұмысшыда L ≥ 0 және L жұп (A, N) бар. A — нақты сан, N — оның орны. K процесс үшін жұптардың жалпы саны 2K, ал барлық N мәндері 1-ден 2K-ға дейін бір рет кездеседі. Түбірге A мәндерін MPI_Send арқылы жібергенде N-ді tag ретінде бер. Түбір оларды N ретімен шығарады.",
            ru: "У каждого рабочего задано L ≥ 0 и L пар (A, N), где A — вещественное число, а N — его позиция. При K процессах всего имеется 2K пар, номера 1…2K встречаются по одному разу. Отправьте A главному процессу через MPI_Send, используя N как тег, и выведите значения по возрастанию N.",
            en: "Each worker has L ≥ 0 and L pairs (A, N), where A is real and N is its position. Across K processes there are 2K pairs and the positions 1 through 2K each appear once. Send each A to the root using MPI_Send with N as its tag, then print the values in ascending N order."
        },
        steps: {
            kk: [
                "valuesByRank мысалында жұптар {N, A} түрінде жазылған. P1-де үш жұп, P2-де жұп жоқ, P3-те бес жұп бар. Әр жұмысшы тек өз жолын оқиды.",
                "Әр A санын MPI_DOUBLE типімен жібер. Tag ретінде сол санның N нөмірін бер. Түбір MPI_ANY_SOURCE және MPI_ANY_TAG арқылы дәл 2K хабар қабылдайды.",
                "Хабардың status.MPI_TAG мәнінен N-ді ал да, A-ны values[N − 1] ұяшығына жаз. Мысалы, tag 7 мәні 7.5 санын жетінші орынға қояды. Соңында массивті басынан аяғына дейін шығар."
            ],
            ru: [
                "В valuesByRank пары записаны как {N, A}. У P1 три пары, у P2 ни одной, у P3 пять. Каждый рабочий читает свою строку.",
                "Отправляйте каждое A типом MPI_DOUBLE с тегом N. Корень принимает ровно 2K сообщений с MPI_ANY_SOURCE и MPI_ANY_TAG.",
                "Возьмите N из status.MPI_TAG и запишите A в values[N − 1]. Например, тег 7 помещает 7.5 на седьмое место. Затем выведите массив по порядку."
            ],
            en: [
                "In valuesByRank each pair is written as {N, A}. P1 has three pairs, P2 has none, and P3 has five. Each worker reads its own row.",
                "Send each A as MPI_DOUBLE using its position N as the tag. Root receives exactly 2K messages with MPI_ANY_SOURCE and MPI_ANY_TAG.",
                "Read N from status.MPI_TAG and place A at values[N − 1]. For example, tag 7 places 7.5 seventh. Print the completed array in order."
            ]
        },
        expected: "values: 1.5 2.5 3.5 4.5 5.5 6.5 7.5 8.5",
        np: 4,
        source: `// MPIBegin27 — Use a message tag as the output position.
#include <mpi.h>
#include <iostream>
#include <utility>
#include <vector>

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Example input by rank: each pair is {position N, real value A}.
    // Keep exactly 2*size entries and use every position from 1 to 2*size once.
    const std::vector<std::vector<std::pair<int, double>>> valuesByRank{
        {},
        {{7, 7.5}, {1, 1.5}, {4, 4.5}},
        {},
        {{8, 8.5}, {3, 3.5}, {2, 2.5}, {6, 6.5}, {5, 5.5}}
    };
    if (size != static_cast<int>(valuesByRank.size())) {
        if (rank == 0) std::cerr << "Run with one process per row of valuesByRank." << std::endl;
        MPI_Finalize();
        return 1;
    }
    const int count = 2 * size;
    std::vector<double> values(count);
    if (rank == 0) {
        for (int i = 0; i < count; ++i) {
            double value = 0.0;
            MPI_Status status;
            MPI_Recv(&value, 1, MPI_DOUBLE, MPI_ANY_SOURCE, MPI_ANY_TAG, MPI_COMM_WORLD, &status);
            values[status.MPI_TAG - 1] = value;
        }

        std::cout << "values:";
        for (double value : values) std::cout << ' ' << value;
        std::cout << std::endl;
    } else {
        for (const auto& [position, value] : valuesByRank[rank]) {
            MPI_Send(&value, 1, MPI_DOUBLE, 0, position, MPI_COMM_WORLD);
        }
    }

    MPI_Finalize();
    return 0;
}
`,
        original: "В каждом подчиненном процессе дано целое число L (≥ 0) и набор из L пар чисел (A, N), где A — вещественное, а N — его порядковый номер. Все числа L в сумме равны 2K, где K — количество процессов; набор номеров N, данных во всех процессах, содержит все целые числа от 1 до 2K. Переслать числа A в главный процесс и вывести их в порядке, соответствующем возрастанию их номеров N. Для передачи номера N указывать его в качестве параметра msgtag функции MPI_Send."
    },
    29: {
        statement: {
            kk: "Әр жұмысшыда T, N және N саннан тұратын тізім бар. T = 0 болса сандар бүтін, T = 1 болса нақты. Тізімді түбірге MPI_Send арқылы жіберіп, T мәнін tag ретінде бер. Түбір MPI_Probe функциясын MPI_ANY_TAG параметрімен шақырып, тізімдерді жіберушілерінің ранг ретімен шығарады.",
            ru: "У каждого рабочего даны T, N и набор из N чисел. При T = 0 числа целые, при T = 1 — вещественные. Отправьте набор корню через MPI_Send с тегом T. Корень использует MPI_Probe с MPI_ANY_TAG и выводит наборы в порядке рангов отправителей.",
            en: "Each worker has T, N, and a list of N numbers. When T = 0 the numbers are integers, and when T = 1 they are real. Send the list to the root with MPI_Send using T as the tag. The root uses MPI_Probe with MPI_ANY_TAG and prints the lists in sender rank order."
        },
        steps: {
            kk: [
                "Мысалда жұп жұмысшылар бүтін тізімді tag 0, тақ жұмысшылар нақты тізімді tag 1 арқылы жібереді. Тізімнің ұзындығы rank % 3 + 1.",
                "Түбір ранг 1-ден бастап жіберушілерді ретімен MPI_Probe арқылы тексереді. Бұл хабарды тұтынбай, оның status.MPI_TAG мәнін білуге мүмкіндік береді.",
                "Tag 0 үшін MPI_INT, tag 1 үшін MPI_DOUBLE таңда. MPI_Get_count арқылы ұзындықты тап. Сәйкес типтегі вектор құрып, хабарды MPI_Recv арқылы қабылда. Мысалы, P2 бүтін [20, 21, 22] жібереді."
            ],
            ru: [
                "В примере чётные рабочие посылают целые числа с тегом 0, нечётные — вещественные с тегом 1. Длина набора равна rank % 3 + 1.",
                "Корень по очереди вызывает MPI_Probe для рангов начиная с 1. Функция проверяет заголовок сообщения, не извлекая сами данные. Тип узнаётся из status.MPI_TAG.",
                "Для тега 0 выберите MPI_INT, для 1 — MPI_DOUBLE. Узнайте длину через MPI_Get_count, выделите вектор нужного типа и вызовите MPI_Recv. Например, P2 отправляет [20, 21, 22]."
            ],
            en: [
                "The example assigns integer lists and tag 0 to even workers, and real lists and tag 1 to odd workers. The list length is rank % 3 + 1.",
                "The root probes each sender in order starting at rank 1. MPI_Probe inspects the message without consuming it. Read the type marker from status.MPI_TAG.",
                "Choose MPI_INT for tag 0 and MPI_DOUBLE for tag 1. Use MPI_Get_count to size a vector of the selected type, then MPI_Recv the message. For example, P2 sends integers [20, 21, 22]."
            ]
        },
        expected: "from 1: 1.5 2\nfrom 2: 20 21 22\nfrom 3: 3.5",
        np: 4,
        source: `// MPIBegin29 — Inspect the tag to select the receive datatype.
#include <mpi.h>
#include <iostream>
#include <vector>

template<class T>
void receiveAndPrint(int source, MPI_Datatype type, MPI_Status& status) {
    int count = 0;
    MPI_Get_count(&status, type, &count);
    std::vector<T> values(count);
    MPI_Recv(values.data(), count, type, source, status.MPI_TAG, MPI_COMM_WORLD, MPI_STATUS_IGNORE);

    std::cout << "from " << source << ":";
    for (T value : values) std::cout << ' ' << value;
    std::cout << std::endl;
}

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    constexpr int integerTag = 0;
    constexpr int realTag = 1;
    if (rank == 0) {
        for (int source = 1; source < size; ++source) {
            MPI_Status status;
            MPI_Probe(source, MPI_ANY_TAG, MPI_COMM_WORLD, &status);
            if (status.MPI_TAG == integerTag) {
                receiveAndPrint<int>(source, MPI_INT, status);
            } else {
                receiveAndPrint<double>(source, MPI_DOUBLE, status);
            }
        }
    } else {
        // Example input: even workers use integers, odd workers use real numbers.
        const int count = rank % 3 + 1;
        if (rank % 2 == 0) {
            std::vector<int> values(count);
            for (int i = 0; i < count; ++i) values[i] = 10 * rank + i;
            MPI_Send(values.data(), count, MPI_INT, 0, integerTag, MPI_COMM_WORLD);
        } else {
            std::vector<double> values(count);
            for (int i = 0; i < count; ++i) values[i] = rank + 0.5 * (i + 1);
            MPI_Send(values.data(), count, MPI_DOUBLE, 0, realTag, MPI_COMM_WORLD);
        }
    }

    MPI_Finalize();
    return 0;
}
`,
        original: "В каждом подчиненном процессе даны два целых числа T, N и набор из N чисел. Число T равно 0 или 1. Набор содержит целые числа, если T = 0, и вещественные числа, если T = 1. Переслать исходные наборы в главный процесс и вывести полученные числа в порядке возрастания рангов переславших их процессов. Для передачи информации о типе пересланного числа указывать число T в качестве параметра msgtag функции MPI_Send, для получения этой информации использовать функцию MPI_Probe с параметром MPI_ANY_TAG."
    }
});

mpiSignalCourse.theory[2] = {
    kk: {
        definitions: [
            ["Нүктеден нүктеге хабар", "Бір жіберушіден бір қабылдаушыға берілетін дерек. Хабарды қабылдау үшін коммуникатор, бастапқы ранг және tag сәйкес болуы керек. MPI_ANY_SOURCE пен MPI_ANY_TAG қабылдау жағындағы таңдауды кеңейтеді."],
            ["MPI_Send және MPI_Recv", "Жіберуші буферді, элемент санын, типті, алушыны және tag-ті береді. Қабылдаушы буфер сыйымдылығын, типті, жіберушіні және tag-ті көрсетеді. Қабылдау нақты хабар келгенше күте алады."],
            ["MPI_Status және MPI_Get_count", "MPI_Status ішінен хабардың нақты жіберушісі мен tag-ін оқуға болады. MPI_Get_count статус пен MPI типін алып, нақты қабылданған элемент санын қайтарады."],
            ["MPI_Probe", "Келесі сәйкес хабардың конвертін деректі буферге көшірместен тексереді. Осыдан кейін белгілі бір жіберуші мен tag-ті қолданып, сәйкес тип пен өлшеммен қабылда."],
            ["MPI_Isend, MPI_Irecv және MPI_Waitall", "Алғашқы екі функция операцияны бастап, MPI_Request сұрауын береді. MPI_Waitall сұраулардың аяқталуын күтеді. MPIBegin23 сияқты көпжақты алмасуда алдымен барлық қабылдауды тіркеп, кейін жіберуді бастау ыңғайлы."],
            ["MPI_Sendrecv", "Бір шақыруда бір бағытқа жіберіп, екінші бағыттан қабылдайды. Жұптар арасында немесе сақинада екі операцияның кезегін бөлек құруды қажет етпейді."]
        ],
        pitfalls: [
            "MPIBegin9-да бір жұмысшы төрт бөлек хабар емес, төрт элементі бар бір хабар жібереді.",
            "MPIBegin15-те N=0 жұмысшылар хабар жібермейді. Бір ғана дерек хабары болғандықтан түбір оны MPI_ANY_SOURCE арқылы қабылдап, MPI_SOURCE өрісін тексереді.",
            "MPIBegin23-те жіберуші өз рангін өткізіп, қалған алушыларға өсу ретімен мән тағайындайды. Әр қабылданған мәнді жіберушінің рангі бойынша ретте.",
            "MPIBegin29-да T=0 болса MPI_INT, T=1 болса MPI_DOUBLE сәйкестендір. Алдымен MPI_Probe және MPI_ANY_TAG арқылы белгіні ал."
        ],
        example: [
            "MPIBegin9. 1-ранг [11, 12, 13, 14], 2-ранг [21, 22, 23, 24] берсін. Әр жұмысшы төрт бүтін санды бір MPI_Send шақыруымен жібереді. 0-ранг бірінші 1-ден, кейін 2-ден қабылдап, екі блокты сол ретпен шығарады.",
            "MPIBegin11. Түбірде [0.75, −1.5, 4.25] болса, үш жұмысшы тиісінше 0.75, −1.5, 4.25 алады. Түбір r жұмысшыға массивтің r−1 индексіндегі бір мәнін жібереді.",
            "MPIBegin15. 1 және 3-рангте N=0, 2-рангте N=2 және [6.25, −2.5] берілсін. 0-ранг MPI_ANY_SOURCE арқылы қабылдап, екі мәнді және статус арқылы алынған жіберуші 2-рангті шығарады."
        ]
    },
    ru: {
        definitions: [
            ["Обмен точка-точка", "Данные идут от одного отправителя к одному получателю. Для сопоставления учитываются коммуникатор, исходный ранг и тег. MPI_ANY_SOURCE и MPI_ANY_TAG расширяют выбор на стороне приёма."],
            ["MPI_Send и MPI_Recv", "Отправитель задаёт буфер, количество, тип, адресата и тег. Получатель задаёт вместимость буфера, тип, отправителя и тег. Приём может ждать появления подходящего сообщения."],
            ["MPI_Status и MPI_Get_count", "Из статуса берут фактического отправителя и тег. MPI_Get_count получает статус и тип MPI и возвращает фактическое число принятых элементов."],
            ["MPI_Probe", "Проверяет параметры следующего подходящего сообщения, не копируя данные в буфер. Затем можно указать обнаруженные ранг и тег и принять данные с нужным типом и длиной."],
            ["MPI_Isend, MPI_Irecv и MPI_Waitall", "Первые две функции запускают операции и возвращают MPI_Request. MPI_Waitall ждёт завершения всех запросов. В обмене вроде MPIBegin23 удобно сначала выставить приёмы, затем начать отправки."],
            ["MPI_Sendrecv", "Объединяет отправку и приём в одном вызове. Удобна для обмена между парами и для сдвигов в кольце, когда отдельно задавать порядок операций затруднительно."]
        ],
        pitfalls: [
            "В MPIBegin9 один рабочий отправляет одно сообщение из четырёх элементов.",
            "В MPIBegin15 рабочие с N=0 пропускают отправку. Корень принимает единственное сообщение данных с MPI_ANY_SOURCE и проверяет MPI_SOURCE.",
            "В MPIBegin23 отправитель пропускает свой ранг и назначает числа остальным получателям по возрастанию. Результаты выводятся по рангу отправителя.",
            "В MPIBegin29 сопоставьте T=0 с MPI_INT, а T=1 с MPI_DOUBLE. Сначала получите тег через MPI_Probe с MPI_ANY_TAG."
        ],
        example: [
            "MPIBegin9. Пусть ранг 1 хранит [11, 12, 13, 14], а ранг 2 — [21, 22, 23, 24]. Каждый рабочий отправляет все четыре целых одним MPI_Send. Ранг 0 принимает от 1, затем от 2 и выводит два блока в этом порядке.",
            "MPIBegin11. Если у корня [0.75, −1.5, 4.25], три рабочих получают соответственно 0.75, −1.5, 4.25. Рабочему r передаётся значение с индексом r−1.",
            "MPIBegin15. Пусть на рангах 1 и 3 N=0, а на ранге 2 N=2 и [6.25, −2.5]. Ранг 0 принимает через MPI_ANY_SOURCE и выводит два значения и ранг отправителя 2, полученный из статуса."
        ]
    },
    en: {
        definitions: [
            ["Point-to-point message", "Data sent by one process to another. Matching uses the communicator, source rank, and tag. MPI_ANY_SOURCE and MPI_ANY_TAG widen the match on the receiving side."],
            ["MPI_Send and MPI_Recv", "The sender supplies the buffer, element count, datatype, destination, and tag. The receiver supplies a buffer capacity, datatype, source, and tag. Receiving can wait until a matching message is available."],
            ["MPI_Status and MPI_Get_count", "The status tells you the actual source rank and tag. Given the status and the MPI datatype, MPI_Get_count reports the number of received elements."],
            ["MPI_Probe", "Inspects the envelope of the next matching message without copying its payload. You can then receive using the discovered source and tag and the appropriate datatype and length."],
            ["MPI_Isend, MPI_Irecv, and MPI_Waitall", "The first two calls start an operation and return an MPI_Request. MPI_Waitall waits for all requests to complete. For an all-peer exchange such as MPIBegin23, post the receives before starting the sends."],
            ["MPI_Sendrecv", "Combines a send and a receive in one call. Useful for pairing ranks or shifting values around a ring without designing a separate operation order."]
        ],
        pitfalls: [
            "In MPIBegin9, each worker sends one message containing four elements.",
            "In MPIBegin15, workers with N=0 skip the send. The root receives the only data message with MPI_ANY_SOURCE and checks MPI_SOURCE.",
            "In MPIBegin23, assign values to the other destinations in ascending order, skipping your own rank. Print results in source rank order.",
            "In MPIBegin29, use MPI_INT for T=0 and MPI_DOUBLE for T=1. Read the tag with MPI_Probe and MPI_ANY_TAG first."
        ],
        example: [
            "In MPIBegin9, let rank 1 hold [11, 12, 13, 14] and rank 2 hold [21, 22, 23, 24]. Each worker sends all four integers with one MPI_Send. Rank 0 receives from 1 and then 2, printing the blocks in that order.",
            "In MPIBegin11, let the root hold [0.75, −1.5, 4.25]. The three workers get 0.75, −1.5, and 4.25, respectively. Worker r receives the element at index r−1.",
            "In MPIBegin15, let N=0 on ranks 1 and 3, and N=2 with [6.25, −2.5] on rank 2. Rank 0 receives with MPI_ANY_SOURCE and prints the two values and source rank 2 from the status."
        ]
    }
};
Object.assign(mpiSignalCourse.exercises, {
    48: {
        np: 3,
        statement: {
            kk: "K процессінің әрқайсысында K + 5 бүтін сан берілген. Индексі бірдей мәндерді барлық процесс бойынша қосыңыз. MPI_Reduce пен MPI_SUM қолданып, қосындыларды негізгі процесте шығарыңыз.",
            ru: "У каждого из K процессов есть K + 5 целых чисел. Сложите по всем процессам значения с одинаковыми индексами с помощью MPI_Reduce и MPI_SUM. Выведите суммы на главном процессе.",
            en: "Each of K processes has K + 5 integers. Sum the values at matching positions across processes with MPI_Reduce and MPI_SUM. Print the sums on the root process."
        },
        steps: {
            kk: [
                "K = 3 болғанда әр рангта 8 элемент бар. Мысалда 0-ранг 1–8, 1-ранг 11–18, 2-ранг 21–28 мәндерін береді. Өз сандарыңыз үшін local толтыратын жолды өзгертіңіз.",
                "Барлық ранг MPI_Reduce шақырады. count = K + 5, MPI_LONG_LONG_INT, MPI_SUM және root = 0 аргументтерін беріңіз. MPI әр бағанды бөлек қосады.",
                "Бірінші бағанның қосындысы 1 + 11 + 21 = 33, келесісі 2 + 12 + 22 = 36. Сол тәртіппен 0-рангтағы барлық 8 қосындыны шығарыңыз."
            ],
            ru: [
                "При K = 3 каждый ранг готовит 8 элементов. В примере ранг 0 даёт числа 1–8, ранг 1 — 11–18, ранг 2 — 21–28. Для своих данных измените заполнение local.",
                "На всех рангах вызовите MPI_Reduce с count = K + 5, MPI_LONG_LONG_INT, MPI_SUM и root = 0. MPI суммирует каждый столбец отдельно.",
                "Первая сумма равна 1 + 11 + 21 = 33, следующая — 2 + 12 + 22 = 36. Выведите все 8 сумм на ранге 0."
            ],
            en: [
                "With K = 3, each rank has 8 elements. In the example, ranks 0, 1, and 2 supply 1–8, 11–18, and 21–28 respectively. Change the initialization of local to use other data.",
                "Call MPI_Reduce on all ranks with count = K + 5, MPI_LONG_LONG_INT, MPI_SUM, and root = 0. MPI sums each column independently.",
                "The first sum is 1 + 11 + 21 = 33 and the second is 2 + 12 + 22 = 36. Print all eight sums on rank 0."
            ]
        },
        expected: "Rank 0: 33 36 39 42 45 48 51 54",
        original: "В каждом процессе дан набор из K + 5 целых чисел, где K — количество процессов. Используя функцию MPI_Reduce для операции MPI_SUM, просуммировать элементы данных наборов с одним и тем же порядковым номером и вывести полученные суммы в главном процессе.",
        source: String.raw`#include <mpi.h>
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    const int count = size + 5;
    std::vector<long long> local(count), sums(count);
    for (int i = 0; i < count; ++i) {
        // Replace this formula to supply other input for the current rank.
        local[i] = 10LL * rank + i + 1;
    }

    MPI_Reduce(local.data(), sums.data(), count, MPI_LONG_LONG_INT, MPI_SUM,
               0, MPI_COMM_WORLD);
    if (rank == 0) {
        std::cout << "Rank 0:";
        for (long long sum : sums) std::cout << ' ' << sum;
        std::cout << '\n';
    }

    MPI_Finalize();
    return 0;
}
`
    },
    50: {
        np: 3,
        statement: {
            kk: "K процессінің әрқайсысында K + 5 бүтін сан берілген. MPI_Reduce пен MPI_MAXLOC көмегімен әр позицияның максимумын және оны берген процестің рангін табыңыз. 0-рангта алдымен максимумдарды, содан кейін олардың рангтерін шығарыңыз.",
            ru: "У каждого из K процессов есть K + 5 целых чисел. Через MPI_Reduce и MPI_MAXLOC найдите максимум и ранг процесса для каждой позиции. На ранге 0 сначала выведите максимумы, затем ранги.",
            en: "Each of K processes holds K + 5 integers. Use MPI_Reduce and MPI_MAXLOC to find the maximum and its originating rank for each position. On rank 0, print all maxima followed by their ranks."
        },
        steps: {
            kk: [
                "Әр рангта K + 5 жұп құрыңыз: бірінші бүтін сан — бастапқы мән, екінші бүтін сан — осы процестің rank мәні. Мысал формуласы әдейі тең максимумдар жасайды.",
                "MPI_Reduce шақырғанда жұптар үшін MPI_2INT типін және MPI_MAXLOC амалын беріңіз. Алдымен мән салыстырылады. Мәндер тең болса, кіші ранг таңдалады.",
                "Нөлінші позицияда 0 және 1 рангтері 10 мәнін береді, сондықтан 0 таңдалады. Екінші позицияда 1 және 2 рангтері 12 мәнін береді, сондықтан 1 таңдалады. Түбір алдымен мәндерді, кейін рангтерді шығарады."
            ],
            ru: [
                "На каждом ранге создайте K + 5 пар: первое целое — исходное значение, второе — rank текущего процесса. Формула примера намеренно создаёт совпадающие максимумы.",
                "Передайте в MPI_Reduce тип пары MPI_2INT и операцию MPI_MAXLOC. Она сравнивает значения, а при равенстве выбирает меньший ранг.",
                "На нулевой позиции ранги 0 и 1 дают значение 10, поэтому выигрывает 0. На позиции 2 ранги 1 и 2 дают значение 12, поэтому выигрывает 1. Корень печатает сначала значения, затем ранги."
            ],
            en: [
                "Build K + 5 pairs on each rank. The first integer is the input value and the second is the current rank. The sample formula deliberately includes ties.",
                "Call MPI_Reduce with MPI_2INT for the pairs and MPI_MAXLOC for the operation. It compares values first and chooses the smaller rank on a tie.",
                "At position 0, ranks 0 and 1 both contribute 10, so rank 0 wins. At position 2, ranks 1 and 2 both contribute 12, so rank 1 wins. Print the values first and the ranks second."
            ]
        },
        expected: "Maxima: 10 11 12 13 14 15 16 17\nRanks: 0 0 1 0 0 1 0 0",
        original: "В каждом процессе дан набор из K + 5 целых чисел, где K — количество процессов. Используя функцию MPI_Reduce для операции MPI_MAXLOC, найти максимальное значение среди элементов данных наборов с одним и тем же порядковым номером и ранг процесса, содержащего это максимальное значение. Вывести в главном процессе вначале все максимумы, а затем — ранги содержащих их процессов.",
        source: String.raw`#include <mpi.h>
#include <array>
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    const int count = size + 5;
    // Two consecutive integers: {value, location}.
    std::vector<std::array<int, 2>> input(count), maxima(count);
    static_assert(sizeof(std::array<int, 2>) == 2 * sizeof(int));
    for (int i = 0; i < count; ++i) {
        // The sample intentionally includes tied maxima.
        const int value = 10 + i - ((i + rank) % size) / 2;
        input[i] = {value, rank};
    }

    MPI_Reduce(input.data(), maxima.data(), count, MPI_2INT, MPI_MAXLOC, 0,
               MPI_COMM_WORLD);
    if (rank == 0) {
        std::cout << "Maxima:";
        for (const auto& pair : maxima) std::cout << ' ' << pair[0];
        std::cout << "\nRanks:";
        for (const auto& pair : maxima) std::cout << ' ' << pair[1];
        std::cout << '\n';
    }

    MPI_Finalize();
    return 0;
}
`
    },
    55: {
        np: 3,
        statement: {
            kk: "Әр процесте K(K + 3)/2 бүтін сан берілген, мұндағы K — процесс саны. MPI_Reduce_scatter көмегімен позициялар бойынша минимумдарды табыңыз. 0-ранг 2 минимум, 1-ранг 3 минимум, ал r-ранг r + 2 минимум алсын. Әр процесс өз бөлігін шығарсын.",
            ru: "Каждый из K процессов содержит K(K + 3)/2 целых чисел. Найдите минимумы по позициям через MPI_Reduce_scatter. Ранг 0 получает 2 минимума, ранг 1 — 3, ранг r — r + 2. Выведите полученные части на каждом ранге.",
            en: "Each of K processes holds K(K + 3)/2 integers. Use MPI_Reduce_scatter to find the per-position minima. Rank 0 receives 2 minima, rank 1 receives 3, and rank r receives r + 2. Print each received block."
        },
        steps: {
            kk: [
                "Барлық процеске бірдей receiveCounts массивін жасаңыз: receiveCounts[r] = r + 2. Оның қосындысы K(K + 3)/2, сондықтан K = 3 кезінде [2, 3, 4] және барлығы 9 элемент шығады.",
                "Әр ранг осы ұзындықта дерек дайындайды. Мысалдағы мәндер 50 + i − ((i + rank) mod K), сондықтан әр бағанның минимумы K = 3 кезінде 48 + i болады.",
                "MPI_Reduce_scatter барлық позицияның минимумын есептеп, нәтижені қатар тұрған блоктарға бөледі. 0-ранг алғашқы 2 мәнді, 1-ранг келесі 3 мәнді, 2-ранг соңғы 4 мәнді шығарады."
            ],
            ru: [
                "Создайте одинаковый массив receiveCounts на каждом ранге: receiveCounts[r] = r + 2. Сумма равна K(K + 3)/2. При K = 3 получаем [2, 3, 4] и 9 элементов всего.",
                "Подготовьте исходные данные этой длины на каждом ранге. Формула 50 + i − ((i + rank) mod K) даёт при K = 3 минимум 48 + i для позиции i.",
                "MPI_Reduce_scatter вычисляет минимумы и раздаёт последовательные блоки. Ранги 0, 1 и 2 печатают первые 2, следующие 3 и последние 4 значения соответственно."
            ],
            en: [
                "Build the same receiveCounts array on all ranks using receiveCounts[r] = r + 2. Its sum is K(K + 3)/2. For K = 3, the counts are [2, 3, 4] and the total is 9.",
                "Prepare that many input values on each rank. The formula 50 + i − ((i + rank) mod K) gives a minimum of 48 + i at position i when K = 3.",
                "MPI_Reduce_scatter computes the minima and distributes contiguous blocks. Ranks 0, 1, and 2 print the first 2, next 3, and final 4 values respectively."
            ]
        },
        expected: "Rank 0: 48 49\nRank 1: 50 51 52\nRank 2: 53 54 55 56",
        original: "В каждом процессе дан набор из K(K + 3)/2 целых чисел, где K — количество процессов. Используя функцию MPI_Reduce_scatter, найти минимальные значения среди элементов этих наборов с одним и тем же порядковым номером и переслать первые два минимума в процесс 0, следующие три — в процесс 1, …, последние K + 1 минимумов — в процесс K − 1. Вывести в каждом процессе полученные данные.",
        source: String.raw`#include <mpi.h>
#include <iostream>
#include <numeric>
#include <sstream>
#include <vector>

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    std::vector<int> receiveCounts(size);
    for (int r = 0; r < size; ++r) receiveCounts[r] = r + 2;

    const int count = std::accumulate(receiveCounts.begin(), receiveCounts.end(), 0);
    std::vector<int> input(count), localMinima(receiveCounts[rank]);
    for (int i = 0; i < count; ++i) {
        // Replace this example formula with the data for the current rank.
        input[i] = 50 + i - (i + rank) % size;
    }

    MPI_Reduce_scatter(input.data(), localMinima.data(), receiveCounts.data(), MPI_INT,
                       MPI_MIN, MPI_COMM_WORLD);
    std::ostringstream line;
    line << "Rank " << rank << ':';
    for (int value : localMinima) line << ' ' << value;
    line << '\n';
    std::cout << line.str();

    MPI_Finalize();
    return 0;
}
`
    },
    57: {
        np: 3,
        statement: {
            kk: "Әр процесте K + 5 бүтін сан бар. MPI_Scan көмегімен r-рангта әр позиция үшін 0-рангтан r-рангқа дейінгі максимумды табыңыз. Әр процесс өз максимумдарын шығарады.",
            ru: "На каждом ранге есть K + 5 целых чисел. Вызовите MPI_Scan, чтобы на ранге r получить максимумы по каждой позиции среди рангов от 0 до r. Выведите результаты на каждом ранге.",
            en: "Each process has K + 5 integers. Use MPI_Scan to find the per-position maxima over ranks 0 through r on rank r. Print the results on every rank."
        },
        steps: {
            kk: [
                "Әр рангта K + 5 элемент дайындаңыз. Мысалда нөлден саналатын жұп позициялар ранг өскен сайын артады, тақ позициялар кемиді.",
                "Барлық ранг MPI_Scan шақырады. Бірдей құрамы бар бастапқы және қабылдау массивтерін, MPI_INT типін және MPI_MAX амалын беріңіз.",
                "Scan өз рангін де қамтиды. Мысалы, 2-рангтың алғашқы екі нәтижесі max(3, 4, 5) = 5 және max(4, 3, 2) = 4. Әр ранг өзінің толық нәтижесін шығарады."
            ],
            ru: [
                "Подготовьте K + 5 значений на каждом ранге. В примере значения в чётных позициях с нулевой индексацией растут с рангом, а в нечётных убывают.",
                "Вызовите MPI_Scan на всех рангах с одинаковым количеством элементов, типом MPI_INT и операцией MPI_MAX.",
                "Scan включает текущий ранг. Например, первые два значения ранга 2 равны max(3, 4, 5) = 5 и max(4, 3, 2) = 4. Каждый ранг печатает весь свой результат."
            ],
            en: [
                "Prepare K + 5 values on each rank. The sample increases with rank at even zero-based positions and decreases at odd positions.",
                "Call MPI_Scan on all ranks with the same count, MPI_INT, and MPI_MAX.",
                "Scan includes the current rank. For example, rank 2 starts with max(3, 4, 5) = 5 and max(4, 3, 2) = 4. Every rank prints its complete result."
            ]
        },
        expected: "Rank 0: 3 4 5 6 7 8 9 10\nRank 1: 4 4 6 6 8 8 10 10\nRank 2: 5 4 7 6 9 8 11 10",
        original: "В каждом процессе дан набор из K + 5 целых чисел, где K — количество процессов. Используя функцию MPI_Scan, найти в процессе ранга R (R = 0, …, K − 1) максимальные значения среди элементов с одним и тем же порядковым номером для наборов, данных в процессах с рангами от 0 до R, и вывести в каждом процессе найденные максимумы.",
        source: String.raw`#include <mpi.h>
#include <iostream>
#include <sstream>
#include <vector>

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    const int count = size + 5;
    std::vector<int> input(count), prefixMaxima(count);
    for (int i = 0; i < count; ++i) {
        // Even sample columns increase with rank; odd columns decrease.
        input[i] = 3 + i + (i % 2 == 0 ? rank : -rank);
    }

    MPI_Scan(input.data(), prefixMaxima.data(), count, MPI_INT, MPI_MAX,
             MPI_COMM_WORLD);
    std::ostringstream line;
    line << "Rank " << rank << ':';
    for (int value : prefixMaxima) line << ' ' << value;
    line << '\n';
    std::cout << line.str();

    MPI_Finalize();
    return 0;
}
`
    },
    59: {
        np: 3,
        statement: {
            kk: "0-рангта K − 1 бүтін үштік берілген. Үш бүтін саннан тұратын құрамды MPI типі мен бір ұжымдық операция көмегімен әр жұмысшы процеске бір үштіктен таратыңыз. Қабылданған мәндерді бастапқы ретімен шығарыңыз.",
            ru: "На ранге 0 есть K − 1 троек целых чисел. С помощью производного MPI-типа из трёх целых и одной коллективной операции отправьте по одной тройке каждому рабочему процессу. Получатели печатают значения в исходном порядке.",
            en: "Rank 0 holds K − 1 triples of integers. Use a derived type of three integers and one collective call to distribute one triple to each worker. Print its elements in the original order."
        },
        steps: {
            kk: [
                "0-рангтың жіберу массивінде K орын ашыңыз. Бірінші орын — түбірге арналған бос үштік. Келесі орындарға (11, 12, 13), (21, 22, 23), … үштіктерін ретімен жазыңыз.",
                "MPI_Type_contiguous(3, MPI_INT, …) арқылы үштік типін жасаңыз және оны MPI_Type_commit арқылы бекітіңіз. MPI_Scatter шақырғанда жіберу мен қабылдау саны — бір үштік.",
                "Түбір 0-орынды елемейді. 1-ранг 11 12 13, 2-ранг 21 22 23 шығарады. Соңында MPI_Type_free арқылы типті босатыңыз."
            ],
            ru: [
                "На ранге 0 выделите K слотов. Первый слот — пустая тройка для корня. В остальные по порядку запишите (11, 12, 13), (21, 22, 23), … .",
                "Создайте тип тройки через MPI_Type_contiguous(3, MPI_INT, …) и зарегистрируйте его через MPI_Type_commit. В MPI_Scatter передайте по одному элементу нового типа для отправки и приёма.",
                "Корень игнорирует слот 0. Ранг 1 печатает 11 12 13, ранг 2 — 21 22 23. Освободите тип через MPI_Type_free."
            ],
            en: [
                "Allocate K slots on rank 0. The first slot is a dummy triple for root. Fill the remaining slots in order with (11, 12, 13), (21, 22, 23), and so on.",
                "Create the triple with MPI_Type_contiguous(3, MPI_INT, …), then commit it with MPI_Type_commit. Use MPI_Scatter with a send and receive count of one triple.",
                "Root ignores slot 0. Rank 1 prints 11 12 13, and rank 2 prints 21 22 23. Release the datatype with MPI_Type_free."
            ]
        },
        expected: "Rank 1: 11 12 13\nRank 2: 21 22 23",
        original: "В главном процессе дана K − 1 тройка целых чисел, где K — количество процессов. Используя производный тип, содержащий три целых числа, и одну коллективную операцию пересылки данных, переслать по одной тройке чисел в каждый из подчиненных процессов и вывести их в подчиненных процессах в том же порядке.",
        source: String.raw`#include <mpi.h>
#include <array>
#include <iostream>
#include <sstream>
#include <vector>

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    using Triple = std::array<int, 3>;
    static_assert(sizeof(Triple) == 3 * sizeof(int));

    std::vector<Triple> input(rank == 0 ? size : 0);
    if (rank == 0) {
        // Slot 0 is a dummy for root. Each other slot holds one worker's triple.
        for (int dest = 1; dest < size; ++dest) {
            const int base = 10 * dest;
            input[dest] = {base + 1, base + 2, base + 3};
        }
    }

    MPI_Datatype tripleType;
    MPI_Type_contiguous(3, MPI_INT, &tripleType);
    MPI_Type_commit(&tripleType);
    Triple received{};
    MPI_Scatter(input.data(), 1, tripleType, received.data(), 1, tripleType,
                0, MPI_COMM_WORLD);
    MPI_Type_free(&tripleType);

    if (rank != 0) {
        std::ostringstream line;
        line << "Rank " << rank << ": " << received[0] << ' '
             << received[1] << ' ' << received[2] << '\n';
        std::cout << line.str();
    }
    MPI_Finalize();
    return 0;
}
`
    },
    63: {
        np: 3,
        statement: {
            kk: "0-рангтан басқа әр процесте бір нақты және екі бүтін сан бар. Осы үш өрістен құрамды MPI типін құрып, жазбаларды 0-рангқа жіберіңіз. Алынған мәндерді жіберушілердің рангтері өсу ретімен шығарыңыз.",
            ru: "На каждом ранге, кроме 0, заданы одно вещественное и два целых числа. Создайте производный MPI-тип из этих полей и передайте записи на ранг 0. Выведите их по возрастанию рангов отправителей.",
            en: "Every rank except 0 holds one real number and two integers. Create a derived MPI datatype for these three fields and send the records to rank 0. Print them in ascending sender-rank order."
        },
        steps: {
            kk: [
                "Record құрылымына бір double және екі int өріс қойыңыз. Мысалда r-ранг (r + 0.5, 10r, −r) жазбасын жібереді.",
                "offsetof әр өрістің нақты байт ығысуын береді. Үш блоктың ұзындығы 1, типтері MPI_DOUBLE, MPI_INT, MPI_INT. Осы параметрлермен MPI_Type_create_struct шақырып, MPI_Type_commit орындаңыз.",
                "Әр жұмысшы count = 1 жазбаны MPI_Send арқылы 0-рангқа жібереді. 0-ранг MPI_Recv-ті 1, 2, … көздерінен кезекпен шақырып, жазбаларды сол ретімен шығарады. Соңында типті босатыңыз."
            ],
            ru: [
                "Опишите Record с одним double и двумя int. В примере ранг r отправляет запись (r + 0.5, 10r, −r).",
                "Получите действительные смещения полей в байтах через offsetof. Длины блоков равны 1, типы — MPI_DOUBLE, MPI_INT, MPI_INT. Создайте и зарегистрируйте тип через MPI_Type_create_struct и MPI_Type_commit.",
                "Каждый рабочий отправляет одну запись через MPI_Send с count = 1. Ранг 0 вызывает MPI_Recv для источников 1, 2, … и печатает записи в этом порядке. После обмена освободите тип."
            ],
            en: [
                "Define a Record with one double and two ints. Rank r sends (r + 0.5, 10r, −r) in the example.",
                "Use offsetof for the actual byte displacement of each field. The three block lengths are 1, and the types are MPI_DOUBLE, MPI_INT, and MPI_INT. Build and commit the type with MPI_Type_create_struct and MPI_Type_commit.",
                "Each worker uses MPI_Send with count = 1. Rank 0 receives successively from sources 1, 2, … and prints in that order. Free the datatype after the exchange."
            ]
        },
        expected: "From 1: 1.5 10 -1\nFrom 2: 2.5 20 -2",
        original: "В каждом подчиненном процессе даны три числа: одно вещественное и два целых. Используя производный тип, содержащий три числа (два целых и одно вещественное), переслать числа из подчиненных процессов в главный и вывести полученные числа в порядке возрастания рангов переславших их процессов.",
        source: String.raw`#include <mpi.h>
#include <cstddef>
#include <iostream>

struct Record {
    double real;
    int first;
    int second;
};

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    Record record{};
    // Use the real byte offsets, including any structure padding.
    MPI_Aint offsets[3] = {
        static_cast<MPI_Aint>(offsetof(Record, real)),
        static_cast<MPI_Aint>(offsetof(Record, first)),
        static_cast<MPI_Aint>(offsetof(Record, second)),
    };

    int lengths[3] = {1, 1, 1};
    MPI_Datatype fieldTypes[3] = {MPI_DOUBLE, MPI_INT, MPI_INT};
    MPI_Datatype recordType;
    MPI_Type_create_struct(3, lengths, offsets, fieldTypes, &recordType);
    MPI_Type_commit(&recordType);

    constexpr int tag = 63;
    if (rank == 0) {
        for (int source = 1; source < size; ++source) {
            MPI_Recv(&record, 1, recordType, source, tag, MPI_COMM_WORLD,
                     MPI_STATUS_IGNORE);
            std::cout << "From " << source << ": " << record.real << ' '
                      << record.first << ' ' << record.second << '\n';
        }
    } else {
        // Replace these three values to choose other local input.
        record = {rank + 0.5, rank * 10, -rank};
        MPI_Send(&record, 1, recordType, 0, tag, MPI_COMM_WORLD);
    }

    MPI_Type_free(&recordType);
    MPI_Finalize();
    return 0;
}
`
    },
    65: {
        np: 3,
        statement: {
            kk: "r ≠ 0 процесінде r үштік бар. Әр үштіктің алғашқы екі өрісі бүтін, соңғысы нақты сан. Құрамды MPI типімен барлық үштікті 0-рангқа жіберіңіз. Түбір оларды жіберушілер рангінің өсу ретімен басып шығарады.",
            ru: "На каждом ранге r ≠ 0 есть r троек из двух целых и одного вещественного числа. Передайте тройки на ранг 0 через производный MPI-тип и выведите их в порядке возрастания рангов отправителей.",
            en: "Every rank r other than rank 0 holds r triples, each with two integers followed by a real number. Send the triples to rank 0 using a derived MPI datatype. Print them in ascending sender-rank order."
        },
        steps: {
            kk: [
                "Record ішіне екі int және бір double қойыңыз. Өріс ығысуларын offsetof арқылы тауып, MPI_Type_create_struct көмегімен құрамды тип жасаңыз.",
                "Бір хабарда бірнеше жазба бар. MPI_Type_create_resized арқылы extent = sizeof(Record) қойыңыз. Сонда MPI келесі жазбаны C++ массивіндегі дұрыс орыннан оқиды. Соңғы типті commit жасаңыз.",
                "r-рангта r жазба дайындаңыз: i-жазба мысалда (10r + i, −i, r + 0.25i). MPI_Send count = r. 0-ранг sender рангінен дәл сонша жазба алып, жіберушілерді 1-ден бастап ретімен шығарады."
            ],
            ru: [
                "Опишите Record из двух int и одного double. Найдите смещения с помощью offsetof и создайте производный тип через MPI_Type_create_struct.",
                "Сообщение содержит несколько записей. Установите extent = sizeof(Record) через MPI_Type_create_resized, чтобы шаг MPI совпадал с шагом массива C++. Зарегистрируйте окончательный тип.",
                "На ранге r подготовьте r записей. Пример записи i: (10r + i, −i, r + 0.25i). Отправьте их с count = r. Ранг 0 принимает от каждого отправителя соответствующее число записей и выводит их по возрастанию ранга."
            ],
            en: [
                "Define Record with two ints and a double. Use offsetof and MPI_Type_create_struct to build the datatype.",
                "One message contains several records. Set its extent to sizeof(Record) with MPI_Type_create_resized so MPI advances by the C++ array stride. Commit the final datatype.",
                "At rank r, prepare r records. The sample uses (10r + i, −i, r + 0.25i) at position i. Send with count = r. Rank 0 receives the matching count from each sender and prints in rank order."
            ]
        },
        expected: "From 1: (10, 0, 1)\nFrom 2: (20, 0, 2) (21, -1, 2.25)",
        original: "В каждом подчиненном процессе даны R троек чисел, где R — ранг процесса. Два первых числа в каждой тройке являются целыми, а последнее — вещественным. Используя производный тип, содержащий три числа (два целых и одно вещественное), переслать числа из подчиненных процессов в главный и вывести полученные числа в порядке возрастания рангов переславших их процессов.",
        source: String.raw`#include <mpi.h>
#include <cstddef>
#include <iostream>
#include <vector>

struct Record {
    int first;
    int second;
    double real;
};

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // Use the real byte offsets, including any structure padding.
    MPI_Aint offsets[3] = {
        static_cast<MPI_Aint>(offsetof(Record, first)),
        static_cast<MPI_Aint>(offsetof(Record, second)),
        static_cast<MPI_Aint>(offsetof(Record, real)),
    };

    int lengths[3] = {1, 1, 1};
    MPI_Datatype fieldTypes[3] = {MPI_INT, MPI_INT, MPI_DOUBLE};
    MPI_Datatype fields, recordType;
    MPI_Type_create_struct(3, lengths, offsets, fieldTypes, &fields);
    MPI_Type_create_resized(fields, 0, static_cast<MPI_Aint>(sizeof(Record)), &recordType);
    MPI_Type_commit(&recordType);
    MPI_Type_free(&fields);

    constexpr int tag = 65;
    if (rank == 0) {
        for (int source = 1; source < size; ++source) {
            std::vector<Record> records(source);
            MPI_Recv(records.data(), source, recordType, source, tag, MPI_COMM_WORLD,
                     MPI_STATUS_IGNORE);
            std::cout << "From " << source << ':';
            for (const Record& record : records) {
                std::cout << " (" << record.first << ", " << record.second
                          << ", " << record.real << ')';
            }
            std::cout << '\n';
        }
    } else {
        std::vector<Record> records(rank);
        for (int i = 0; i < rank; ++i) {
            // Replace these fields to choose another example.
            records[i] = {rank * 10 + i, -i, rank + 0.25 * i};
        }
        MPI_Send(records.data(), rank, recordType, 0, tag, MPI_COMM_WORLD);
    }

    MPI_Type_free(&recordType);
    MPI_Finalize();
    return 0;
}
`
    },
    67: {
        np: 3,
        statement: {
            kk: "0-рангта K − 1 үштік бар. Әр үштіктің реті: бүтін, нақты, бүтін. Қаптау функциялары мен бір ұжымдық операция арқылы әр жұмысшыға бір үштіктен жіберіңіз. Жұмысшылар қабылдаған үштігін сол ретпен шығарады.",
            ru: "На ранге 0 есть K − 1 троек вида «целое, вещественное, целое». Используйте функции упаковки и одну коллективную операцию, чтобы передать по одной тройке каждому рабочему. Получатель печатает значения в том же порядке.",
            en: "Rank 0 has K − 1 triples in integer, real, integer order. Use packing and one collective operation to deliver one triple to each worker. Each worker prints its values in that order."
        },
        steps: {
            kk: [
                "MPI_Pack_size арқылы екі бөлек бүтін өріс пен бір нақты өріске орын есептеңіз. Сол қосындыны stride ретінде қолданыңыз. 0-ранг әр жұмысшыға бірдей ұзындықтағы жеке ұяшық бөледі.",
                "Әр өңделетін ұяшық үшін position = 0. MPI_Pack шақыруларының реті: MPI_INT, MPI_DOUBLE, MPI_INT. Түбірдің 0-ұяшығы бос қалады.",
                "MPI_Scatter операциясымен әр рангқа stride MPI_PACKED байт таратыңыз. Жұмысшы MPI_Unpack көмегімен өрістерді қапталған ретімен шығарады. Мысал: 1-ранг 11 1.5 13, 2-ранг 21 2.5 23."
            ],
            ru: [
                "Используйте MPI_Pack_size для двух отдельных целых полей и одного вещественного. Их сумма задаёт stride. Ранг 0 выделяет одинаковый по длине слот для каждого получателя.",
                "Начинайте с position = 0 в каждом слоте. Вызывайте MPI_Pack в порядке MPI_INT, MPI_DOUBLE, MPI_INT. Слот 0 для корня остаётся пустым.",
                "Один MPI_Scatter раздаёт каждому рангу stride байт с MPI_PACKED. Рабочие вызывают MPI_Unpack в порядке упаковки. Ранг 1 печатает 11 1.5 13, ранг 2 — 21 2.5 23."
            ],
            en: [
                "Use MPI_Pack_size for two separately packed integer fields and one real field. The total sets the slot stride. Rank 0 allocates one fixed-width slot per destination.",
                "Start each slot with position = 0. Pack the fields in MPI_INT, MPI_DOUBLE, MPI_INT order. Leave the root slot empty.",
                "One MPI_Scatter transfers stride bytes with MPI_PACKED to each rank. Workers unpack and print the same field order. Rank 1 prints 11 1.5 13, and rank 2 prints 21 2.5 23."
            ]
        },
        expected: "Rank 1: 11 1.5 13\nRank 2: 21 2.5 23",
        original: "В главном процессе дана K − 1 тройка чисел, где K — количество процессов, причем первое и третье число каждой тройки является целым, а второе число — вещественным. Используя функции упаковки и одну коллективную операцию пересылки данных, переслать по одной тройке чисел в подчиненные процессы и вывести их в подчиненных процессах в том же порядке.",
        source: String.raw`#include <mpi.h>
#include <iostream>
#include <sstream>
#include <vector>

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int intCapacity = 0, doubleCapacity = 0;
    MPI_Pack_size(1, MPI_INT, MPI_COMM_WORLD, &intCapacity);
    MPI_Pack_size(1, MPI_DOUBLE, MPI_COMM_WORLD, &doubleCapacity);
    const int stride = 2 * intCapacity + doubleCapacity;

    std::vector<char> packed(rank == 0 ? static_cast<std::size_t>(size) * stride : 0, 0);
    if (rank == 0) {
        // The first slot is a dummy for root. Pack each worker's triple independently.
        for (int dest = 1; dest < size; ++dest) {
            const int first = 10 * dest + 1;
            const double middle = dest + 0.5;
            const int last = 10 * dest + 3;
            char* slot = packed.data() + static_cast<std::size_t>(dest) * stride;
            int position = 0;
            MPI_Pack(&first, 1, MPI_INT, slot, stride, &position, MPI_COMM_WORLD);
            MPI_Pack(&middle, 1, MPI_DOUBLE, slot, stride, &position, MPI_COMM_WORLD);
            MPI_Pack(&last, 1, MPI_INT, slot, stride, &position, MPI_COMM_WORLD);
        }
    }

    std::vector<char> received(stride);
    MPI_Scatter(packed.data(), stride, MPI_PACKED, received.data(), stride,
                MPI_PACKED, 0, MPI_COMM_WORLD);
    if (rank != 0) {
        int first = 0, last = 0, position = 0;
        double middle = 0;
        MPI_Unpack(received.data(), stride, &position, &first, 1, MPI_INT, MPI_COMM_WORLD);
        MPI_Unpack(received.data(), stride, &position, &middle, 1, MPI_DOUBLE, MPI_COMM_WORLD);
        MPI_Unpack(received.data(), stride, &position, &last, 1, MPI_INT, MPI_COMM_WORLD);

        std::ostringstream line;
        line << "Rank " << rank << ": " << first << ' ' << middle << ' ' << last << '\n';
        std::cout << line.str();
    }

    MPI_Finalize();
    return 0;
}
`
    },
    69: {
        np: 3,
        statement: {
            kk: "Әр жұмысшы процесте екі бүтін және бір нақты сан берілген. Қаптау функциялары мен бір ұжымдық операцияны қолданып, оларды 0-рангқа жинаңыз. Түбір мәндерді жіберушілердің рангтері өсу ретімен шығарады.",
            ru: "На каждом рабочем процессе заданы два целых и одно вещественное число. Используйте функции упаковки и одну коллективную операцию для сбора данных на ранге 0. Корень печатает значения по возрастанию рангов отправителей.",
            en: "Each worker holds two integers and one real number. Use packing and one collective call to gather them on rank 0. Root prints the records in ascending sender-rank order."
        },
        steps: {
            kk: [
                "Әр жұмысшы stride өлшемді буфер бөледі. Сыйымдылықты MPI_Pack_size арқылы екі MPI_INT және бір MPI_DOUBLE үшін есептеңіз. Алдымен бүтін жұпты, кейін нақты санды бір position айнымалысымен қаптаңыз.",
                "Барлық ранг MPI_Gather-ді бір рет шақырады. Жіберу және қабылдау блогы — stride MPI_PACKED байт. 0-ранг алынған K блоктың өзіне тиесілі бірінші блогын елемейді.",
                "0-ранг әр жұмысшының блогын кезекпен ашады. Әр блокта position = 0-ден бастаңыз. Алдымен 1-рангтан 11 12 1.5, кейін 2-рангтан 21 22 2.5 шығады."
            ],
            ru: [
                "Каждый рабочий выделяет буфер stride. Получите размер через MPI_Pack_size для двух MPI_INT и одного MPI_DOUBLE. С одной переменной position упакуйте сначала пару целых, затем вещественное.",
                "Все ранги один раз вызывают MPI_Gather. Размер отправляемого и принимаемого блока — stride байт MPI_PACKED. Ранг 0 пропускает свой первый блок из K принятых.",
                "На ранге 0 по порядку распакуйте блоки рабочих. Для каждого блока начните с position = 0. Сначала выводятся 11 12 1.5 от ранга 1, затем 21 22 2.5 от ранга 2."
            ],
            en: [
                "Each worker allocates a stride-byte buffer. Use MPI_Pack_size for two MPI_INT and one MPI_DOUBLE. Pack the integer pair and then the real value using one position variable.",
                "All ranks call MPI_Gather once. The per-rank block is stride bytes with MPI_PACKED. Rank 0 skips its own first slot among the K gathered blocks.",
                "On rank 0, unpack worker slots in order, starting every slot at position = 0. Print 11 12 1.5 from rank 1, then 21 22 2.5 from rank 2."
            ]
        },
        expected: "Rank 0 <- Rank 1: 11 12 1.5\nRank 0 <- Rank 2: 21 22 2.5",
        original: "В каждом подчиненном процессе даны три числа: два целых и одно вещественное. Используя функции упаковки и одну коллективную операцию пересылки данных, переслать числа из подчиненных процессов в главный и вывести полученные числа в порядке возрастания рангов переславших их процессов.",
        source: String.raw`#include <mpi.h>
#include <array>
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
    MPI_Init(&argc, &argv);
    int rank = 0, size = 0;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int intCapacity = 0, doubleCapacity = 0;
    MPI_Pack_size(2, MPI_INT, MPI_COMM_WORLD, &intCapacity);
    MPI_Pack_size(1, MPI_DOUBLE, MPI_COMM_WORLD, &doubleCapacity);
    const int stride = intCapacity + doubleCapacity;
    std::vector<char> packed(stride, 0);
    if (rank != 0) {
        // Replace these three values to choose other local input.
        const std::array<int, 2> values{10 * rank + 1, 10 * rank + 2};
        const double real = rank + 0.5;
        int position = 0;
        MPI_Pack(values.data(), 2, MPI_INT, packed.data(), stride, &position, MPI_COMM_WORLD);
        MPI_Pack(&real, 1, MPI_DOUBLE, packed.data(), stride, &position, MPI_COMM_WORLD);
    }

    std::vector<char> gathered(rank == 0 ? static_cast<std::size_t>(size) * stride : 0);
    MPI_Gather(packed.data(), stride, MPI_PACKED, gathered.data(), stride,
               MPI_PACKED, 0, MPI_COMM_WORLD);
    if (rank == 0) {
        for (int source = 1; source < size; ++source) {
            const char* slot = gathered.data() + static_cast<std::size_t>(source) * stride;
            std::array<int, 2> values{};
            double real = 0;
            int position = 0;
            MPI_Unpack(slot, stride, &position, values.data(), 2, MPI_INT, MPI_COMM_WORLD);
            MPI_Unpack(slot, stride, &position, &real, 1, MPI_DOUBLE, MPI_COMM_WORLD);
            std::cout << "Rank 0 <- Rank " << source << ": " << values[0] << ' '
                      << values[1] << ' ' << real << '\n';
        }
    }

    MPI_Finalize();
    return 0;
}
`
    }
});

mpiSignalCourse.theory[3] = {
    kk: {
        definitions: [
            ["MPI_Reduce", "Бір коммуникатордағы процестердің бірдей индекстегі элементтерін MPI_SUM, MPI_MIN немесе MPI_MAX секілді амалмен біріктіреді. Нәтиже түбірлік рангте жазылады."],
            ["MPI_MAXLOC", "Мән мен орны бар жұптарға арналған редукция амалы. Ең үлкен мәнді, теңдік жағдайында ең кіші орынды алады. Бүтін мән мен бүтін ранг үшін MPI_2INT типін қолдануға болады."],
            ["MPI_Scan және MPI_Reduce_scatter", "MPI_Scan әр рангке 0-ден сол рангке дейінгі процестердің жинақталған нәтижесін береді. MPI_Reduce_scatter барлық рангтің дерегін біріктіріп, нәтижедегі бөліктерді recvcounts бойынша таратады."],
            ["Туынды MPI типі", "Бір шақыруда біртекті элементтерді немесе бірнеше C++ өрісін жеткізуге арналған сипаттама. Тізбектес үш int үшін MPI_Type_contiguous, әртүрлі өрістер үшін MPI_Type_create_struct қолданылады."],
            ["Ығысу және extent", "MPI_Get_address арқылы өріс адресін алып, құрылымның бастапқы адресін азайтсаң, байттық ығысуды табасың. Бірнеше жазба жібергенде типтің extent мәні жазбалардың жадыдағы қадамына сәйкес болуы керек."],
            ["MPI_Pack және MPI_Unpack", "Әртүрлі мәндерді бір буферге кезекпен жинап, сол ретпен қайта оқиды. MPI_Pack_size сыйымдылық шегін, position жазылған немесе оқылған байттардың келесі орнын көрсетеді."]
        ],
        pitfalls: [
            "MPIBegin48-де баған бойынша MPI_SUM қолданылады. MPIBegin57-де сол бағандардың 0-ден ағымдағы рангке дейінгі максимумы керек.",
            "MPIBegin59-да әр жұмысшы бір үштік алады. Қарапайым MPI_Scatter үшін 0-рангтің орнына жарамды бос үштік қарастыр.",
            "MPIBegin63-те нақты өріс бірінші, MPIBegin65-те соңғы. Құрылым массивінде extent оның жадыдағы қадамына сәйкес болуы керек.",
            "MPIBegin67 мен MPIBegin69-да қаптау және ашу кезінде тип пен өріс реті сәйкес болсын. Бірдей өлшемді блок қолдансаң, буфер шекараларын сақта."
        ],
        example: [
            "MPIBegin48. K=2 болғанда әр рангте K+5=7 бүтін сан болады. P0=[1, 2, 3, 4, 5, 6, 7], P1=[7, 6, 5, 4, 3, 2, 1] болса, MPI_Reduce және MPI_SUM түбірге [8, 8, 8, 8, 8, 8, 8] береді.",
            "MPIBegin50-де осы массивтер үшін максимумдар [7, 6, 5, 4, 5, 6, 7], ал рангтер [1, 1, 1, 0, 0, 0, 0]. Төртінші позициядағы теңдікте MPI_MAXLOC кіші рангті таңдайды.",
            "MPIBegin59. P0-дағы екі үштік [10, 11, 12] және [20, 21, 22] болсын. Үш MPI_INT-тен туынды тип құрастырып, P0-ге арналған бос орынды қос. MPI_Scatter арқылы P1 бірінші, P2 екінші үштікті алады.",
            "MPIBegin67-де ұқсас бөлу орындалады. Бұл жолы [10, 1.25, 12] және [20, 2.5, 22] үштіктерінің тип реті int, double, int. Әр жұмысшы өзіне тиесілі қапталған блокты ғана ашады."
        ]
    },
    ru: {
        definitions: [
            ["MPI_Reduce", "Объединяет элементы с одинаковыми индексами со всех рангов коммуникатора операцией, например MPI_SUM, MPI_MIN или MPI_MAX. Результат записывается на корневом ранге."],
            ["MPI_MAXLOC", "Операция над парами из значения и позиции. Выбирает максимальное значение, при равенстве — наименьшую позицию. Для целого значения и целого ранга подходит MPI_2INT."],
            ["MPI_Scan и MPI_Reduce_scatter", "MPI_Scan возвращает каждому рангу результат объединения данных с рангов от 0 до него. MPI_Reduce_scatter объединяет данные всех рангов и распределяет отрезки результата по recvcounts."],
            ["Производный тип MPI", "Описание группы однотипных элементов или нескольких полей C++ для передачи одним вызовом. Три соседних int описывают через MPI_Type_contiguous, поля разных типов через MPI_Type_create_struct."],
            ["Смещение и extent", "Вычтите адрес начала структуры из адреса поля, полученного через MPI_Get_address. При передаче массива записей extent должен соответствовать шагу между записями в памяти."],
            ["MPI_Pack и MPI_Unpack", "Последовательно записывают значения разных типов в общий буфер и читают их обратно в том же порядке. MPI_Pack_size оценивает вместимость, position указывает позицию следующей записи или чтения."]
        ],
        pitfalls: [
            "В MPIBegin48 складывайте элементы одинаковых позиций через MPI_SUM. В MPIBegin57 нужен максимум по позициям от ранга 0 до текущего.",
            "В MPIBegin59 каждому рабочему соответствует одна тройка. Для обычного MPI_Scatter предусмотрите допустимую фиктивную тройку для ранга 0.",
            "В MPIBegin63 вещественное поле первое, в MPIBegin65 — последнее. При передаче массива структур extent должен совпадать с шагом между записями.",
            "В MPIBegin67 и MPIBegin69 согласуйте порядок и тип полей при упаковке и распаковке. При одинаковом размере блоков соблюдайте их границы."
        ],
        example: [
            "MPIBegin48. При K=2 на каждом ранге K+5=7 целых. Для P0=[1, 2, 3, 4, 5, 6, 7] и P1=[7, 6, 5, 4, 3, 2, 1] MPI_Reduce с MPI_SUM возвращает корню [8, 8, 8, 8, 8, 8, 8].",
            "В MPIBegin50 те же массивы дают максимумы [7, 6, 5, 4, 5, 6, 7] и ранги [1, 1, 1, 0, 0, 0, 0]. На четвёртой позиции значения равны, поэтому MPI_MAXLOC выбирает меньший ранг.",
            "MPIBegin59. Пусть у P0 есть две тройки [10, 11, 12] и [20, 21, 22]. Создайте тип из трёх MPI_INT и добавьте фиктивную позицию для P0. В MPI_Scatter P1 получает первую тройку, P2 — вторую.",
            "В MPIBegin67 распределение такое же, но тройки [10, 1.25, 12] и [20, 2.5, 22] идут в порядке int, double, int. Каждый рабочий распаковывает свой блок."
        ]
    },
    en: {
        definitions: [
            ["MPI_Reduce", "Combines matching element positions across a communicator using an operation such as MPI_SUM, MPI_MIN, or MPI_MAX. The result is written on the root rank."],
            ["MPI_MAXLOC", "A reduction operator on value and location pairs. It chooses the maximum value and breaks ties using the smallest location. Use MPI_2INT for an integer value paired with an integer rank."],
            ["MPI_Scan and MPI_Reduce_scatter", "MPI_Scan returns each rank's reduction over ranks 0 through that rank. MPI_Reduce_scatter reduces data across every rank and distributes the resulting segments according to recvcounts."],
            ["Derived MPI datatype", "A description for transferring adjacent elements or multiple C++ fields in one call. Use MPI_Type_contiguous for three adjacent integers or MPI_Type_create_struct for fields of different types."],
            ["Displacement and extent", "Subtract the structure's starting address from a field address obtained with MPI_Get_address to get its byte displacement. When sending an array of records, the datatype extent must match the stride between records."],
            ["MPI_Pack and MPI_Unpack", "Write values of several types into a common buffer, then extract them in the same order. MPI_Pack_size estimates capacity, and position indicates where the next field is written or read."]
        ],
        pitfalls: [
            "MPIBegin48 sums corresponding positions with MPI_SUM. MPIBegin57 computes per-position maxima from rank 0 through the current rank.",
            "MPIBegin59 gives each worker one triple. For ordinary MPI_Scatter, reserve a valid dummy triple for rank 0.",
            "MPIBegin63 puts the real-valued field first, and MPIBegin65 puts it last. When sending an array of structs, match the datatype extent to the record stride.",
            "MPIBegin67 and MPIBegin69 require a consistent field type and order when packing and unpacking. Keep within each block when using equal-sized slots."
        ],
        example: [
            "In MPIBegin48, K=2 gives K+5=7 integers per rank. With P0=[1, 2, 3, 4, 5, 6, 7] and P1=[7, 6, 5, 4, 3, 2, 1], MPI_Reduce with MPI_SUM returns [8, 8, 8, 8, 8, 8, 8] on the root.",
            "In MPIBegin50, the same arrays yield maxima [7, 6, 5, 4, 5, 6, 7] and ranks [1, 1, 1, 0, 0, 0, 0]. The fourth position ties, so MPI_MAXLOC chooses the smaller rank.",
            "In MPIBegin59, suppose P0 holds the two triples [10, 11, 12] and [20, 21, 22]. Create a datatype from three MPI_INT values and add a dummy slot for P0. MPI_Scatter gives P1 the first triple and P2 the second.",
            "MPIBegin67 follows the same assignment, but the example triples [10, 1.25, 12] and [20, 2.5, 22] follow the type order int, double, int. Each worker unpacks its own block."
        ]
    }
};
mpiSignalCourse.exercises[32] = {
  "statement": {
    "kk": "Әр процестің нақты санын 0-рангке ретімен жинау.",
    "ru": "В каждом процессе дано вещественное число. Используя функцию MPI_Gather, переслать эти числа в главный процесс и вывести их в порядке возрастания рангов переславших их процессов (первым вывести число, данное в главном процессе).",
    "en": "Gather one real number per rank at root, in rank order."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Gather операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Gather.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Gather.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 0.5 1.5 2.5 3.5",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n double a=r+0.5; vector<double> b(k); MPI_Gather(&a,1,MPI_DOUBLE,b.data(),1,MPI_DOUBLE,0,MPI_COMM_WORLD); if(!r) print(b);\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе дано вещественное число. Используя функцию MPI_Gather, переслать эти числа в главный процесс и вывести их в порядке возрастания рангов переславших их процессов (первым вывести число, данное в главном процессе)."
};

mpiSignalCourse.exercises[33] = {
  "statement": {
    "kk": "Әр процестегі бес бүтін санды 0-рангке жинау.",
    "ru": "В каждом процессе дан набор из 5 целых чисел. Используя функцию MPI_Gather, переслать эти наборы в главный процесс и вывести их в порядке возрастания рангов переславших их процессов (первым вывести набор чисел, данный в главном процессе).",
    "en": "Gather five integers per rank at root, in rank order."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Gather операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Gather.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Gather.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 0 1 2 3 4 10 11 12 13 14 20 21 22 23 24 30 31 32 33 34",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n vector<int> a(5),b(5*k); for(int i=0;i<5;i++) a[i]=10*r+i; MPI_Gather(a.data(),5,MPI_INT,b.data(),5,MPI_INT,0,MPI_COMM_WORLD); if(!r) print(b);\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе дан набор из 5 целых чисел. Используя функцию MPI_Gather, переслать эти наборы в главный процесс и вывести их в порядке возрастания рангов переславших их процессов (первым вывести набор чисел, данный в главном процессе)."
};

mpiSignalCourse.exercises[37] = {
  "statement": {
    "kk": "Бастапқы массивті өзгертпей, сандарды кері ранг ретімен тарату.",
    "ru": "В главном процессе дан набор из K чисел, где K — количество процессов. Не меняя порядок расположения чисел в исходном наборе и используя функцию MPI_Scatterv, переслать по одному числу в каждый процесс; при этом первое число надо переслать в процесс K − 1, второе число — в процесс K − 2, …, последнее число — в процесс 0. Вывести в каждом процессе полученное число.",
    "en": "Scatter one number per rank in reverse rank order without rearranging input."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Scatterv операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Scatterv.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Scatterv.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 13\n1: 12\n2: 11\n3: 10",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n vector<double> a(k); vector<int> c(k,1),d(k); for(int i=0;i<k;i++){a[i]=10+i;d[i]=k-1-i;} double b; MPI_Scatterv(a.data(),c.data(),d.data(),MPI_DOUBLE,&b,1,MPI_DOUBLE,0,MPI_COMM_WORLD); print(vector<double>{b});\n MPI_Finalize();return 0;\n}\n",
  "original": "В главном процессе дан набор из K чисел, где K — количество процессов. Не меняя порядок расположения чисел в исходном наборе и используя функцию MPI_Scatterv, переслать по одному числу в каждый процесс; при этом первое число надо переслать в процесс K − 1, второе число — в процесс K − 2, …, последнее число — в процесс 0. Вывести в каждом процессе полученное число."
};

mpiSignalCourse.exercises[40] = {
  "statement": {
    "kk": "Әр процестің нақты санын барлық процестерге жинау.",
    "ru": "В каждом процессе дано вещественное число. Используя функцию MPI_Allgather, переслать эти числа во все процессы и вывести их в каждом процессе в порядке возрастания рангов переславших их процессов (включая число, полученное из этого же процесса).",
    "en": "Gather each real number on every rank in rank order."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Allgather операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Allgather.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Allgather.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "Every rank: 0.5 1.5 2.5 3.5",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n double a=r+0.5; vector<double> b(k); MPI_Allgather(&a,1,MPI_DOUBLE,b.data(),1,MPI_DOUBLE,MPI_COMM_WORLD); print(b);\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе дано вещественное число. Используя функцию MPI_Allgather, переслать эти числа во все процессы и вывести их в каждом процессе в порядке возрастания рангов переславших их процессов (включая число, полученное из этого же процесса)."
};

mpiSignalCourse.exercises[44] = {
  "statement": {
    "kk": "Әр процестегі 3K бүтін саннан әр рангке үш сандық блоктарды жіберу.",
    "ru": "В каждом процессе дан набор из 3K целых чисел, где K — количество процессов. Используя функцию MPI_Alltoall, переслать в каждый процесс три очередных числа из каждого набора (в процесс 0 — первые три числа, в процесс 1 — следующие три числа, и т. д.). В каждом процессе вывести числа в порядке возрастания рангов переславших их процессов (включая числа, полученные из этого же процесса).",
    "en": "Exchange three integers per destination from each rank, in source rank order."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Alltoall операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Alltoall.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Alltoall.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 0 1 2 100 101 102 200 201 202\n1: 3 4 5 103 104 105 203 204 205\n2: 6 7 8 106 107 108 206 207 208",
  "np": 3,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=3){if(!r) cerr<<\"Use 3 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n vector<int>a(3*k),b(3*k); for(int i=0;i<3*k;i++)a[i]=100*r+i; MPI_Alltoall(a.data(),3,MPI_INT,b.data(),3,MPI_INT,MPI_COMM_WORLD); print(b);\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе дан набор из 3K целых чисел, где K — количество процессов. Используя функцию MPI_Alltoall, переслать в каждый процесс три очередных числа из каждого набора (в процесс 0 — первые три числа, в процесс 1 — следующие три числа, и т. д.). В каждом процессе вывести числа в порядке возрастания рангов переславших их процессов (включая числа, полученные из этого же процесса)."
};

mpiSignalCourse.exercises[47] = {
  "statement": {
    "kk": "Әр массивтен кері ретпен екі көршілес санды әр процеске тарату.",
    "ru": "В каждом процессе дан набор из K + 1 числа, где K — количество процессов. Используя функцию MPI_Alltoallv, переслать в каждый процесс два числа из каждого набора; при этом в процесс 0 надо переслать последние два числа, в процесс 1 — два числа, предшествующих последнему, …, в последний процесс — первые два числа каждого набора. В каждом процессе вывести полученные числа.",
    "en": "Exchange overlapping pairs, with the last pair going to rank 0."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Alltoallv операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Alltoallv.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Alltoallv.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 2 3 12 13 22 23\n1: 1 2 11 12 21 22\n2: 0 1 10 11 20 21",
  "np": 3,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=3){if(!r) cerr<<\"Use 3 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n vector<double>a(k+1),b(2*k);vector<int> c(k,2),s(k),d(k);for(int i=0;i<=k;i++)a[i]=10*r+i;for(int i=0;i<k;i++){s[i]=k-1-i;d[i]=2*i;} MPI_Alltoallv(a.data(),c.data(),s.data(),MPI_DOUBLE,b.data(),c.data(),d.data(),MPI_DOUBLE,MPI_COMM_WORLD);print(b);\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе дан набор из K + 1 числа, где K — количество процессов. Используя функцию MPI_Alltoallv, переслать в каждый процесс два числа из каждого набора; при этом в процесс 0 надо переслать последние два числа, в процесс 1 — два числа, предшествующих последнему, …, в последний процесс — первые два числа каждого набора. В каждом процессе вывести полученные числа."
};

mpiSignalCourse.exercises[72] = {
  "statement": {
    "kk": "Тек тақ рангтерден коммуникатор құрып, екі нақты санды барлық мүшесіне жинау.",
    "ru": "В каждом процессе нечетного ранга (1, 3, …) даны два вещественных числа. С помощью функций MPI_Comm_group, MPI_Group_excl и MPI_Comm_create создать новый коммуникатор, включающий процессы нечетного ранга. Используя одну коллективную операцию пересылки данных для созданного коммуникатора, переслать исходные числа во все процессы нечетного ранга и вывести эти числа в порядке возрастания рангов переславших их процессов (включая числа, полученные из этого же процесса).",
    "en": "Create a communicator of odd ranks and allgather two real numbers per member."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Group_excl / MPI_Allgather операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Group_excl / MPI_Allgather.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Group_excl / MPI_Allgather.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "1, 3: 1.5 2.5 3.5 4.5",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n MPI_Group g,h;MPI_Comm_group(MPI_COMM_WORLD,&g);vector<int> ev;for(int i=0;i<k;i+=2)ev.push_back(i);MPI_Group_excl(g,ev.size(),ev.data(),&h);MPI_Comm c;MPI_Comm_create(MPI_COMM_WORLD,h,&c);if(c!=MPI_COMM_NULL){double a[2]={r+0.5,r+1.5};vector<double>b(2*(k/2));MPI_Allgather(a,2,MPI_DOUBLE,b.data(),2,MPI_DOUBLE,c);print(b);MPI_Comm_free(&c);}MPI_Group_free(&h);MPI_Group_free(&g);\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе нечетного ранга (1, 3, …) даны два вещественных числа. С помощью функций MPI_Comm_group, MPI_Group_excl и MPI_Comm_create создать новый коммуникатор, включающий процессы нечетного ранга. Используя одну коллективную операцию пересылки данных для созданного коммуникатора, переслать исходные числа во все процессы нечетного ранга и вывести эти числа в порядке возрастания рангов переславших их процессов (включая числа, полученные из этого же процесса)."
};

mpiSignalCourse.exercises[75] = {
  "statement": {
    "kk": "Жұп рангтердің максимумын 0-рангте, тақ рангтердің минимумын 1-рангте шығару.",
    "ru": "В каждом процессе дано вещественное число. Используя функцию MPI_Comm_split и одну коллективную операцию редукции, найти максимальное из чисел, данных в процессах с четным рангом (включая главный процесс), и минимальное из чисел, данных в процессах с нечетным рангом. Найденный максимум вывести в процессе 0, а найденный минимум — в процессе 1.",
    "en": "Find the maximum of even ranks at rank 0 and minimum of odd ranks at rank 1."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Comm_split / MPI_Reduce операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Comm_split / MPI_Reduce.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Comm_split / MPI_Reduce.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 2.5\n1: 1.5",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n MPI_Comm c;MPI_Comm_split(MPI_COMM_WORLD,r%2,r,&c);int q;MPI_Comm_rank(c,&q);double a=r+0.5,b;MPI_Reduce(&a,&b,1,MPI_DOUBLE,r%2?MPI_MIN:MPI_MAX,0,c);if(!q)print(vector<double>{b});MPI_Comm_free(&c);\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе дано вещественное число. Используя функцию MPI_Comm_split и одну коллективную операцию редукции, найти максимальное из чисел, данных в процессах с четным рангом (включая главный процесс), и минимальное из чисел, данных в процессах с нечетным рангом. Найденный максимум вывести в процессе 0, а найденный минимум — в процессе 1."
};

mpiSignalCourse.exercises[76] = {
  "statement": {
    "kk": "N=1 болатын жұмысшыларға түбірден бір нақты сан тарату.",
    "ru": "В главном процессе дано целое число K и набор из K вещественных чисел, в каждом подчиненном процессе дано целое число N, которое может принимать два значения: 0 и 1 (количество подчиненных процессов с N = 1 равно K). Используя функцию MPI_Comm_split и одну коллективную операцию пересылки, переслать по одному вещественному числу из главного процесса в каждый подчиненный процесс с N = 1 и вывести в этих подчиненных процессах полученные числа.",
    "en": "Scatter one real number from root to each selected worker with N=1."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Comm_split / MPI_Scatter операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Comm_split / MPI_Scatter.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Comm_split / MPI_Scatter.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "1: 10\n3: 20",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n MPI_Comm c;bool selected=r==0||r%2==1;MPI_Comm_split(MPI_COMM_WORLD,selected?0:MPI_UNDEFINED,r,&c);if(selected){int n;MPI_Comm_size(c,&n);vector<double>a(n);for(int i=1;i<n;i++)a[i]=10*i;double b;MPI_Scatter(a.data(),1,MPI_DOUBLE,&b,1,MPI_DOUBLE,0,c);if(r)print(vector<double>{b});MPI_Comm_free(&c);}\n MPI_Finalize();return 0;\n}\n",
  "original": "В главном процессе дано целое число K и набор из K вещественных чисел, в каждом подчиненном процессе дано целое число N, которое может принимать два значения: 0 и 1 (количество подчиненных процессов с N = 1 равно K). Используя функцию MPI_Comm_split и одну коллективную операцию пересылки, переслать по одному вещественному числу из главного процесса в каждый подчиненный процесс с N = 1 и вывести в этих подчиненных процессах полученные числа."
};

mpiSignalCourse.exercises[78] = {
  "statement": {
    "kk": "N=1 процестерінің нақты сандарын соңғы таңдалған процеске жинау.",
    "ru": "В каждом процессе дано целое число N, которое может принимать два значения: 0 и 1 (имеется хотя бы один процесс с N = 1). Кроме того, в каждом процессе с N = 1 дано вещественное число A. Используя функцию MPI_Comm_split и одну коллективную операцию пересылки данных, переслать числа A в последний из процессов с N = 1 и вывести их в порядке возрастания рангов переславших их процессов (включая число, полученное из этого же процесса).",
    "en": "Gather selected real numbers at the last selected rank."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Comm_split / MPI_Gather операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Comm_split / MPI_Gather.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Comm_split / MPI_Gather.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "3: 1.5 3.5",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n MPI_Comm c;bool s=r%2==1;MPI_Comm_split(MPI_COMM_WORLD,s?0:MPI_UNDEFINED,r,&c);if(s){int q,n;MPI_Comm_rank(c,&q);MPI_Comm_size(c,&n);double a=r+0.5;vector<double>b(n);MPI_Gather(&a,1,MPI_DOUBLE,b.data(),1,MPI_DOUBLE,n-1,c);if(q==n-1)print(b);MPI_Comm_free(&c);}\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе дано целое число N, которое может принимать два значения: 0 и 1 (имеется хотя бы один процесс с N = 1). Кроме того, в каждом процессе с N = 1 дано вещественное число A. Используя функцию MPI_Comm_split и одну коллективную операцию пересылки данных, переслать числа A в последний из процессов с N = 1 и вывести их в порядке возрастания рангов переславших их процессов (включая число, полученное из этого же процесса)."
};

mpiSignalCourse.exercises[81] = {
  "statement": {
    "kk": "N=1 процестеріндегі A сандарының қосындысын сол процестердің бәріне шығару.",
    "ru": "В каждом процессе дано целое число N, которое может принимать два значения: 0 и 1 (имеется хотя бы один процесс с N = 1). Кроме того, в каждом процессе с N = 1 дано вещественное число A. Используя функцию MPI_Comm_split и одну коллективную операцию редукции, найти сумму всех исходных чисел A и вывести ее во всех процессах с N = 1.",
    "en": "Sum A on selected ranks and return the sum to every selected rank."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Comm_split / MPI_Allreduce операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Comm_split / MPI_Allreduce.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Comm_split / MPI_Allreduce.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "1, 3: 5",
  "np": 4,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=4){if(!r) cerr<<\"Use 4 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n MPI_Comm c;bool s=r%2==1;MPI_Comm_split(MPI_COMM_WORLD,s?0:MPI_UNDEFINED,r,&c);if(s){double a=r+0.5,b;MPI_Allreduce(&a,&b,1,MPI_DOUBLE,MPI_SUM,c);print(vector<double>{b});MPI_Comm_free(&c);}\n MPI_Finalize();return 0;\n}\n",
  "original": "В каждом процессе дано целое число N, которое может принимать два значения: 0 и 1 (имеется хотя бы один процесс с N = 1). Кроме того, в каждом процессе с N = 1 дано вещественное число A. Используя функцию MPI_Comm_split и одну коллективную операцию редукции, найти сумму всех исходных чисел A и вывести ее во всех процессах с N = 1."
};

mpiSignalCourse.exercises[84] = {
  "statement": {
    "kk": "Алғашқы N×⌊K/N⌋ процестен тор құрып, координаталарын шығару.",
    "ru": "В главном процессе дано целое число N (> 1), не превосходящее количества процессов K. Переслать число K во все процессы, после чего определить декартову топологию для начальной части процессов в виде двумерной решетки — матрицы размера N × K/N (символ «/» обозначает операцию деления нацело, порядок нумерации процессов следует оставить прежним). Для каждого процесса, включенного в декартову топологию, вывести его координаты в этой топологии.",
    "en": "Create an N by floor(K/N) Cartesian grid and print included ranks’ coordinates."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Cart_create / MPI_Cart_coords операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Cart_create / MPI_Cart_coords.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Cart_create / MPI_Cart_coords.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 0 0\n1: 0 1\n2: 1 0\n3: 1 1",
  "np": 5,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=5){if(!r) cerr<<\"Use 5 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n int n=2;MPI_Bcast(&n,1,MPI_INT,0,MPI_COMM_WORLD);int d[2]={n,k/n},p[2]={0,0};MPI_Comm c;MPI_Cart_create(MPI_COMM_WORLD,2,d,p,0,&c);if(c!=MPI_COMM_NULL){int xy[2];MPI_Cart_coords(c,r,2,xy);print(vector<int>{xy[0],xy[1]});MPI_Comm_free(&c);}\n MPI_Finalize();return 0;\n}\n",
  "original": "В главном процессе дано целое число N (> 1), не превосходящее количества процессов K. Переслать число K во все процессы, после чего определить декартову топологию для начальной части процессов в виде двумерной решетки — матрицы размера N × K/N (символ «/» обозначает операцию деления нацело, порядок нумерации процессов следует оставить прежним). Для каждого процесса, включенного в декартову топологию, вывести его координаты в этой топологии."
};

mpiSignalCourse.exercises[86] = {
  "statement": {
    "kk": "N×2 торының екі бағанына 0 және 1 рангтерден нақты сан тарату.",
    "ru": "Число процессов К является четным: K = 2N, N > 1. В процессах 0 и 1 дано по одному вещественному числу A. Определить для всех процессов декартову топологию в виде матрицы размера N × 2, после чего, используя функцию MPI_Cart_sub, расщепить матрицу процессов на два одномерных столбца (при этом процессы 0 и 1 будут главными процессами в полученных столбцах). Используя одну коллективную операцию пересылки данных, переслать число A из главного процесса каждого столбца во все процессы этого же столбца и вывести полученное число в каждом процессе (включая процессы 0 и 1).",
    "en": "Split an N by 2 grid into columns and broadcast from ranks 0 and 1."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Cart_sub / MPI_Bcast операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Cart_sub / MPI_Bcast.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Cart_sub / MPI_Bcast.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0, 2, 4: 10\n1, 3, 5: 20",
  "np": 6,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=6){if(!r) cerr<<\"Use 6 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n int d[2]={k/2,2},p[2]={0,0},keep[2]={1,0};MPI_Comm c,s;MPI_Cart_create(MPI_COMM_WORLD,2,d,p,0,&c);MPI_Cart_sub(c,keep,&s);double a=10*(r+1);MPI_Bcast(&a,1,MPI_DOUBLE,0,s);print(vector<double>{a});MPI_Comm_free(&s);MPI_Comm_free(&c);\n MPI_Finalize();return 0;\n}\n",
  "original": "Число процессов К является четным: K = 2N, N > 1. В процессах 0 и 1 дано по одному вещественному числу A. Определить для всех процессов декартову топологию в виде матрицы размера N × 2, после чего, используя функцию MPI_Cart_sub, расщепить матрицу процессов на два одномерных столбца (при этом процессы 0 и 1 будут главными процессами в полученных столбцах). Используя одну коллективную операцию пересылки данных, переслать число A из главного процесса каждого столбца во все процессы этого же столбца и вывести полученное число в каждом процессе (включая процессы 0 и 1)."
};

mpiSignalCourse.exercises[90] = {
  "statement": {
    "kk": "2×2×K/4 торын үшінші координатасы бірдей жазықтықтарға бөліп, әр жазықтықтың түбіріне бүтін сандарды жинау.",
    "ru": "Количество процессов K равно 8 или 12, в каждом процессе дано целое число. Определить для всех процессов декартову топологию в виде трехмерной решетки размера 2 × 2 × K/4 (порядок нумерации процессов оставить прежним). Интерпретируя полученную решетку как K/4 матриц размера 2 × 2 (в одну матрицу входят процессы с одинаковой третьей координатой), расщепить эту решетку на K/4 указанных матриц. Используя одну коллективную операцию пересылки данных, переслать в главный процесс каждой из полученных матриц исходные числа из процессов этой же матрицы и вывести полученные наборы чисел (включая числа, полученные из главных процессов матриц).",
    "en": "Split the 3D grid into 2 by 2 planes by third coordinate and gather integers at each plane root."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Cart_sub / MPI_Gather операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Cart_sub / MPI_Gather.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Cart_sub / MPI_Gather.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 0 2 4 6\n1: 1 3 5 7",
  "np": 8,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=8){if(!r) cerr<<\"Use 8 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n int d[3]={2,2,k/4},p[3]={0,0,0},keep[3]={1,1,0};MPI_Comm c,s;MPI_Cart_create(MPI_COMM_WORLD,3,d,p,0,&c);MPI_Cart_sub(c,keep,&s);int q;MPI_Comm_rank(s,&q);int a=r;vector<int>b(4);MPI_Gather(&a,1,MPI_INT,b.data(),1,MPI_INT,0,s);if(!q)print(b);MPI_Comm_free(&s);MPI_Comm_free(&c);\n MPI_Finalize();return 0;\n}\n",
  "original": "Количество процессов K равно 8 или 12, в каждом процессе дано целое число. Определить для всех процессов декартову топологию в виде трехмерной решетки размера 2 × 2 × K/4 (порядок нумерации процессов оставить прежним). Интерпретируя полученную решетку как K/4 матриц размера 2 × 2 (в одну матрицу входят процессы с одинаковой третьей координатой), расщепить эту решетку на K/4 указанных матриц. Используя одну коллективную операцию пересылки данных, переслать в главный процесс каждой из полученных матриц исходные числа из процессов этой же матрицы и вывести полученные наборы чисел (включая числа, полученные из главных процессов матриц)."
};

mpiSignalCourse.exercises[93] = {
  "statement": {
    "kk": "Бірінші өлшемі периодты M×N торында X,Y координаталарының рангін анықтау; жарамсыз болса −1.",
    "ru": "В главном процессе даны положительные целые числа M и N, произведение которых не превосходит количества процессов; кроме того, в процессах с рангами от 0 до M·N − 1 даны целые числа X и Y. Переслать числа M и N во все процессы, после чего определить для начальных M·N процессов декартову топологию в виде двумерной решетки размера M × N, являющейся периодической по первому измерению (порядок нумерации процессов оставить прежним). В каждом процессе, входящем в созданную топологию, вывести ранг процесса с координатами X, Y (с учетом периодичности), используя для этого функцию MPI_Cart_rank. В случае недопустимых координат вывести −1.",
    "en": "Find rank at X,Y in a grid periodic in the first dimension; return -1 for invalid coordinates."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Cart_rank операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Cart_rank.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Cart_rank.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 3\n1: 1\n2: 5\n3: -1\n4: 3\n5: 1",
  "np": 6,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=6){if(!r) cerr<<\"Use 6 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n int d[2]={2,3},p[2]={1,0};MPI_Bcast(d,2,MPI_INT,0,MPI_COMM_WORLD);MPI_Comm c;MPI_Cart_create(MPI_COMM_WORLD,2,d,p,0,&c);if(c!=MPI_COMM_NULL){int xy[2]={r-1,r%4},b=-1;if(xy[1]>=0&&xy[1]<d[1])MPI_Cart_rank(c,xy,&b);print(vector<int>{b});MPI_Comm_free(&c);}\n MPI_Finalize();return 0;\n}\n",
  "original": "В главном процессе даны положительные целые числа M и N, произведение которых не превосходит количества процессов; кроме того, в процессах с рангами от 0 до M·N − 1 даны целые числа X и Y. Переслать числа M и N во все процессы, после чего определить для начальных M·N процессов декартову топологию в виде двумерной решетки размера M × N, являющейся периодической по первому измерению (порядок нумерации процессов оставить прежним). В каждом процессе, входящем в созданную топологию, вывести ранг процесса с координатами X, Y (с учетом периодичности), используя для этого функцию MPI_Cart_rank. В случае недопустимых координат вывести −1."
};

mpiSignalCourse.exercises[97] = {
  "statement": {
    "kk": "2×2×K/4 торындағы нақты сандарды келесі жазықтыққа циклдік жылжыту.",
    "ru": "Количество процессов K равно 8 или 12, в каждом процессе дано вещественное число. Определить для всех процессов декартову топологию в виде трехмерной решетки размера 2 × 2 × K/4 (порядок нумерации процессов оставить прежним). Интерпретируя полученную решетку как K/4 матриц размера 2 × 2 (в одну матрицу входят процессы с одинаковой третьей координатой, матрицы упорядочены по возрастанию третьей координаты), осуществить циклический сдвиг исходных данных из процессов каждой матрицы в соответствующие процессы следующей матрицы (из процессов последней матрицы данные перемещаются в первую матрицу). Для определения рангов посылающих и принимающих процессов использовать функцию MPI_Cart_shift, пересылку выполнять с помощью функции MPI_Sendrecv_replace. Во всех процессах вывести полученные данные.",
    "en": "Cyclically shift real values to the next plane along the third coordinate."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Cart_shift / MPI_Sendrecv_replace операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Cart_shift / MPI_Sendrecv_replace.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Cart_shift / MPI_Sendrecv_replace.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 1.5\n1: 0.5\n2: 3.5\n3: 2.5\n4: 5.5\n5: 4.5\n6: 7.5\n7: 6.5",
  "np": 8,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=8){if(!r) cerr<<\"Use 8 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n int d[3]={2,2,k/4},p[3]={0,0,1};MPI_Comm c;MPI_Cart_create(MPI_COMM_WORLD,3,d,p,0,&c);int src,dst;MPI_Cart_shift(c,2,1,&src,&dst);double a=r+0.5;MPI_Sendrecv_replace(&a,1,MPI_DOUBLE,dst,0,src,0,c,MPI_STATUS_IGNORE);print(vector<double>{a});MPI_Comm_free(&c);\n MPI_Finalize();return 0;\n}\n",
  "original": "Количество процессов K равно 8 или 12, в каждом процессе дано вещественное число. Определить для всех процессов декартову топологию в виде трехмерной решетки размера 2 × 2 × K/4 (порядок нумерации процессов оставить прежним). Интерпретируя полученную решетку как K/4 матриц размера 2 × 2 (в одну матрицу входят процессы с одинаковой третьей координатой, матрицы упорядочены по возрастанию третьей координаты), осуществить циклический сдвиг исходных данных из процессов каждой матрицы в соответствующие процессы следующей матрицы (из процессов последней матрицы данные перемещаются в первую матрицу). Для определения рангов посылающих и принимающих процессов использовать функцию MPI_Cart_shift, пересылку выполнять с помощью функции MPI_Sendrecv_replace. Во всех процессах вывести полученные данные."
};

mpiSignalCourse.exercises[100] = {
  "statement": {
    "kk": "Үш өзара байланысқан процестен тұратын сәулелері бар жұлдыз графында көршілермен бүтін сан алмасу.",
    "ru": "Количество процессов K равно 3N + 1 (1 < N < 5); в каждом процессе дано целое число A. Используя функцию MPI_Graph_create, определить для всех процессов топологию графа, в которой процессы R, R + 1, R + 2, где R = 1, 4, 7, …, связаны между собой ребрами, и, кроме того, каждый процесс положительного ранга, кратного трем (3, 6, …), связан ребром с главным процессом (в результате получается N-лучевая звезда, центром которой является главный процесс, а каждый луч состоит из трех связанных между собой процессов, причем с центром связан процесс ранга, кратного трем). Переслать число A из каждого процесса всем процессамсоседям. Для определения количества процессов-соседей и их рангов использовать функции MPI_Graph_neighbors_count и MPI_Graph_neighbors, пересылку выполнять с помощью функции MPI_Sendrecv. Во всех процессах вывести полученные числа в порядке возрастания рангов переславших их процессов.",
    "en": "Exchange integers with all neighbors in a star of three-node cliques connected to root by every third rank."
  },
  "steps": {
    "kk": [
      "MPI ортасын іске қосып, ранг пен процесс санын анықта.",
      "Мысал деректерін дайында және MPI_Graph_create / MPI_Sendrecv операциясын орында.",
      "Нәтижені тиісті рангтерде шығар; MPI_Finalize шақыр."
    ],
    "ru": [
      "Инициализируйте MPI и определите ранг и число процессов.",
      "Подготовьте пример данных и выполните MPI_Graph_create / MPI_Sendrecv.",
      "Выведите результат в нужных процессах и завершите MPI."
    ],
    "en": [
      "Initialize MPI and obtain rank and size.",
      "Prepare sample data and use MPI_Graph_create / MPI_Sendrecv.",
      "Print results on the required ranks and finalize MPI."
    ]
  },
  "expected": "0: 30 60\n1: 20 30\n2: 10 30\n3: 0 10 20\n4: 50 60\n5: 40 60\n6: 0 40 50",
  "np": 7,
  "source": "#include <mpi.h>\n#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\nusing namespace std;\nint main(int argc,char** argv){\n MPI_Init(&argc,&argv);\n int r,k; MPI_Comm_rank(MPI_COMM_WORLD,&r); MPI_Comm_size(MPI_COMM_WORLD,&k);\n if(k!=7){if(!r) cerr<<\"Use 7 processes\\n\";MPI_Finalize();return 1;}\n auto print=[&](const auto& v){ostringstream s;s<<r<<\":\";for(auto x:v)s<<\" \"<<x;cout<<s.str()<<endl;};\n vector<vector<int>> adj(k);auto edge=[&](int x,int y){adj[x].push_back(y);adj[y].push_back(x);};for(int i=1;i<k;i+=3){edge(i,i+1);edge(i,i+2);edge(i+1,i+2);edge(0,i+2);}vector<int> idx,edges;for(auto &v:adj){sort(v.begin(),v.end());edges.insert(edges.end(),v.begin(),v.end());idx.push_back(edges.size());}MPI_Comm c;MPI_Graph_create(MPI_COMM_WORLD,k,idx.data(),edges.data(),0,&c);int n;MPI_Graph_neighbors_count(c,r,&n);vector<int> nbr(n),b;MPI_Graph_neighbors(c,r,n,nbr.data());sort(nbr.begin(),nbr.end());for(int j:nbr){int a=r*10,z;MPI_Sendrecv(&a,1,MPI_INT,j,0,&z,1,MPI_INT,j,0,c,MPI_STATUS_IGNORE);b.push_back(z);}print(b);MPI_Comm_free(&c);\n MPI_Finalize();return 0;\n}\n",
  "original": "Количество процессов K равно 3N + 1 (1 < N < 5); в каждом процессе дано целое число A. Используя функцию MPI_Graph_create, определить для всех процессов топологию графа, в которой процессы R, R + 1, R + 2, где R = 1, 4, 7, …, связаны между собой ребрами, и, кроме того, каждый процесс положительного ранга, кратного трем (3, 6, …), связан ребром с главным процессом (в результате получается N-лучевая звезда, центром которой является главный процесс, а каждый луч состоит из трех связанных между собой процессов, причем с центром связан процесс ранга, кратного трем). Переслать число A из каждого процесса всем процессамсоседям. Для определения количества процессов-соседей и их рангов использовать функции MPI_Graph_neighbors_count и MPI_Graph_neighbors, пересылку выполнять с помощью функции MPI_Sendrecv. Во всех процессах вывести полученные числа в порядке возрастания рангов переславших их процессов."
};

mpiSignalCourse.theory[4] = {
  "kk": {
    "definitions": [
      [
        "MPI_Gather",
        "Деректерді түбірге ранг ретімен жинайды."
      ],
      [
        "MPI_Scatterv",
        "Әр рангке count және displacement арқылы бөліктер таратады."
      ],
      [
        "MPI_Allgather",
        "Жиналған деректерді барлық процеске береді."
      ],
      [
        "MPI_Alltoallv",
        "Әр процесс әр басқа процеске жеке блок жібереді."
      ],
      [
        "MPI_Comm_split",
        "Түс пен кілт бойынша жаңа коммуникатор құрады."
      ],
      [
        "MPI_Group_excl",
        "Көрсетілген рангтерді топтан алып тастайды."
      ]
    ],
    "pitfalls": [
      "Ұжымдық функцияны коммуникатордың барлық мүшесі шақырады.",
      "MPI_COMM_NULL ішінде операция орындама."
    ],
    "example": [
      "MPIBegin37: [10,11,12,13] → [13,12,11,10]."
    ]
  },
  "ru": {
    "definitions": [
      [
        "MPI_Gather",
        "Собирает данные на корневом процессе в порядке рангов."
      ],
      [
        "MPI_Scatterv",
        "Распределяет части по счетчикам и смещениям."
      ],
      [
        "MPI_Allgather",
        "Собирает данные на всех процессах."
      ],
      [
        "MPI_Alltoallv",
        "Обмен блоками переменной длины."
      ],
      [
        "MPI_Comm_split",
        "Создает коммуникаторы по цвету и ключу."
      ],
      [
        "MPI_Group_excl",
        "Исключает указанные ранги из группы."
      ]
    ],
    "pitfalls": [
      "Коллективную функцию вызывают все члены коммуникатора.",
      "Не используйте MPI_COMM_NULL для обмена."
    ],
    "example": [
      "MPIBegin37: [10,11,12,13] → [13,12,11,10]."
    ]
  },
  "en": {
    "definitions": [
      [
        "MPI_Gather",
        "Collects data at the root in rank order."
      ],
      [
        "MPI_Scatterv",
        "Distributes blocks using counts and displacements."
      ],
      [
        "MPI_Allgather",
        "Collects data at every process."
      ],
      [
        "MPI_Alltoallv",
        "Exchanges variable-size blocks among ranks."
      ],
      [
        "MPI_Comm_split",
        "Creates communicators by color and key."
      ],
      [
        "MPI_Group_excl",
        "Excludes specified ranks from a group."
      ]
    ],
    "pitfalls": [
      "Every member calls the collective.",
      "Do not communicate on MPI_COMM_NULL."
    ],
    "example": [
      "MPIBegin37: [10,11,12,13] → [13,12,11,10]."
    ]
  }
};

mpiSignalCourse.theory[5] = {
  "kk": {
    "definitions": [
      [
        "MPI_Cart_create",
        "Көп өлшемді декарттық тор құрады."
      ],
      [
        "MPI_Cart_coords",
        "Рангтің тор координаталарын анықтайды."
      ],
      [
        "MPI_Cart_sub",
        "Торды ішкі торларға бөледі."
      ],
      [
        "MPI_Cart_rank",
        "Координаталар бойынша рангті табады."
      ],
      [
        "MPI_Cart_shift",
        "Берілген бағыттағы жіберуші және қабылдаушы рангтерін береді."
      ],
      [
        "MPI_Graph_create",
        "Граф түріндегі виртуалды топологияны құрады."
      ]
    ],
    "pitfalls": [
      "Торға кірмеген процестер MPI_COMM_NULL алады.",
      "Периодты емес өлшемдегі жарамсыз координатаны тексер."
    ],
    "example": [
      "MPIBegin86: P0,P2,P4 бір бағанда, P1,P3,P5 екінші бағанда."
    ]
  },
  "ru": {
    "definitions": [
      [
        "MPI_Cart_create",
        "Создает декартову решетку."
      ],
      [
        "MPI_Cart_coords",
        "Определяет координаты ранга."
      ],
      [
        "MPI_Cart_sub",
        "Разбивает решетку на подрешетки."
      ],
      [
        "MPI_Cart_rank",
        "Определяет ранг по координатам."
      ],
      [
        "MPI_Cart_shift",
        "Определяет ранги соседей для сдвига."
      ],
      [
        "MPI_Graph_create",
        "Создает графовую топологию."
      ]
    ],
    "pitfalls": [
      "Исключенные процессы получают MPI_COMM_NULL.",
      "Проверяйте координаты непериодических измерений."
    ],
    "example": [
      "MPIBegin86: P0,P2,P4 в одном столбце, P1,P3,P5 в другом."
    ]
  },
  "en": {
    "definitions": [
      [
        "MPI_Cart_create",
        "Creates a Cartesian grid."
      ],
      [
        "MPI_Cart_coords",
        "Returns coordinates of a rank."
      ],
      [
        "MPI_Cart_sub",
        "Splits a grid into subgrids."
      ],
      [
        "MPI_Cart_rank",
        "Finds a rank from coordinates."
      ],
      [
        "MPI_Cart_shift",
        "Finds source and destination ranks for a shift."
      ],
      [
        "MPI_Graph_create",
        "Creates a graph topology."
      ]
    ],
    "pitfalls": [
      "Excluded ranks receive MPI_COMM_NULL.",
      "Check coordinates in nonperiodic dimensions."
    ],
    "example": [
      "MPIBegin86: P0,P2,P4 in one column, P1,P3,P5 in the other."
    ]
  }
};
// ==================================================
// MPI SIGNAL PRO — НӨЛДЕН БАСТАП ҮЙРЕНУ
// Кеңейтілген теориялық база
// ==================================================

(() => {

    function addTheory(module, entries) {

        const languages = ['kk', 'ru', 'en'];

        languages.forEach((language, index) => {

            const moduleTheory =
                mpiSignalCourse.theory[module] ??= {};

            const theory = moduleTheory[language] ??= {
                definitions: [],
                pitfalls: [],
                example: []
            };

            theory.definitions = [
                ...entries.map(entry => entry[index]),
                ...theory.definitions
            ];

        });
    }

    // ==========================================
    // 1-МОДУЛЬ. MPI НЕГІЗДЕРІ
    // ==========================================

    addTheory(1, [

        [
            [
                "1. Бағдарлама дегеніміз не?",
                "Бағдарлама — компьютерге белгілі бір тапсырманы орындау үшін берілетін командалар жиынтығы. Мысалы, калькулятор екі санды қосады, браузер веб-сайтты ашады. Бағдарламалар C++, Python, Java сияқты тілдерде жазылады."
            ],
            [
                "1. Что такое программа?",
                "Программа — набор команд для выполнения определённой задачи компьютером. Например, калькулятор складывает числа, а браузер открывает сайты."
            ],
            [
                "1. What is a program?",
                "A program is a collection of instructions that tells a computer how to perform a task."
            ]
        ],

        [
            [
                "2. Алгоритм дегеніміз не?",
                "Алгоритм — тапсырманы шешуге арналған реттелген қадамдар жиынтығы. Мысалы: бірінші санды енгізу, екінші санды енгізу, екі санды қосу, нәтижені шығару."
            ],
            [
                "2. Что такое алгоритм?",
                "Алгоритм — последовательность шагов для решения задачи."
            ],
            [
                "2. What is an algorithm?",
                "An algorithm is a sequence of steps used to solve a problem."
            ]
        ],

        [
            [
                "3. Процессор дегеніміз не?",
                "Процессор (CPU) — компьютердің есептеулерді орындайтын негізгі құрылғысы. Заманауи процессорларда бірнеше ядро болуы мүмкін. Бірнеше ядро тәуелсіз есептерді қатар орындауға мүмкіндік береді."
            ],
            [
                "3. Что такое процессор?",
                "CPU — устройство, выполняющее вычисления и инструкции. Несколько ядер позволяют выполнять независимые задачи одновременно."
            ],
            [
                "3. What is a CPU?",
                "A CPU executes instructions and calculations. Multiple cores can perform independent work simultaneously."
            ]
        ],

        [
            [
                "4. Процесс пен процессордың айырмашылығы",
                "Процессор — физикалық құрылғы. Процесс — орындалып жатқан бағдарламаның данасы. Бір процессорда бірнеше процесс жұмыс істей алады. MPI-дегі P0, P1, P2 белгілері физикалық процессорларды емес, процестерді білдіреді."
            ],
            [
                "4. Процесс и процессор",
                "Процессор — физическое устройство, а процесс — выполняющийся экземпляр программы. P0 и P1 обозначают процессы, а не обязательно разные процессоры."
            ],
            [
                "4. Process versus processor",
                "A processor is hardware. A process is a running instance of a program. MPI ranks do not necessarily represent separate processors."
            ]
        ],

        [
            [
                "5. Тізбекті бағдарламалау",
                "Тізбекті бағдарламалауда командалар бірінен кейін бірі орындалады. Мысалы, 1000 санды бір процесс ретімен қосады. Келесі есептеу алдыңғы әрекеттен кейін орындалады."
            ],
            [
                "5. Последовательное программирование",
                "Команды выполняются последовательно, одна за другой."
            ],
            [
                "5. Sequential programming",
                "Instructions are executed one after another."
            ]
        ],

        [
            [
                "6. Параллельді бағдарламалау",
                "Параллельді бағдарламалау — есепті бірнеше бөлікке бөліп, оларды қатар орындау тәсілі. Мысалы, 1000 санды 4 процеске 250 саннан бөліп беруге болады. Соңында төрт бөліктің нәтижесі біріктіріледі."
            ],
            [
                "6. Параллельное программирование",
                "Задача делится на части, которые могут выполняться одновременно несколькими процессами."
            ],
            [
                "6. Parallel programming",
                "A problem is divided into parts that can execute simultaneously."
            ]
        ],

        [
            [
                "7. MPI дегеніміз не?",
                "MPI (Message Passing Interface) — процестер арасында хабарламалармен алмасуға арналған стандарт. Ол параллель бағдарламалар жазуға мүмкіндік береді. MPI жеке бағдарламалау тілі емес. Open MPI, MPICH және Microsoft MPI — осы стандарттың іске асырылулары."
            ],
            [
                "7. Что такое MPI?",
                "MPI — стандарт обмена сообщениями между процессами. Open MPI, MPICH и Microsoft MPI являются его реализациями."
            ],
            [
                "7. What is MPI?",
                "MPI is a standard interface for exchanging messages between processes. Open MPI, MPICH and Microsoft MPI implement this standard."
            ]
        ],

        [
            [
                "8. MPI не үшін қолданылады?",
                "MPI үлкен көлемдегі есептерді бірнеше процеске бөлу үшін қолданылады. Мысалы, ауа райын болжау, ғылыми модельдеу, үлкен матрицаларды есептеу және суперкомпьютерлердегі зерттеулер."
            ],
            [
                "8. Зачем нужен MPI?",
                "MPI используется для распределения больших вычислительных задач между процессами."
            ],
            [
                "8. Why use MPI?",
                "MPI distributes large computational problems across multiple processes."
            ]
        ],

        [
            [
                "9. Ортақ және таратылған жады",
                "Ортақ жады моделінде бірнеше орындаушы бір жады кеңістігін пайдалана алады. Таратылған жады моделінде әр процесс өз жадымен жұмыс істейді. MPI процестері әдетте жеке жады кеңістігіне ие және деректерді хабарлама арқылы алмасады."
            ],
            [
                "9. Общая и распределённая память",
                "При распределённой памяти процессы имеют собственные адресные пространства и обмениваются сообщениями."
            ],
            [
                "9. Shared and distributed memory",
                "Distributed-memory processes have separate address spaces and communicate by passing messages."
            ]
        ],

        [
            [
                "10. Rank — процесс рангі",
                "Rank — коммуникатор ішіндегі процестің реттік нөмірі. Нөмірлеу 0-ден басталады. Егер төрт процесс болса, олардың рангтері 0, 1, 2 және 3 болады. Ранг арқылы әр процеске жеке тапсырма беруге болады."
            ],
            [
                "10. Rank — ранг процесса",
                "Ранг — номер процесса внутри коммуникатора. Нумерация начинается с нуля."
            ],
            [
                "10. Rank",
                "A rank identifies a process within a communicator. Ranks start at zero."
            ]
        ],

        [
            [
                "11. Size — процестер саны",
                "Size — коммуникатордағы процестердің жалпы саны. Мысалы, 4 процесс іске қосылса, size = 4 болады. Соңғы процестің рангі size - 1 формуласы арқылы анықталады."
            ],
            [
                "11. Size — число процессов",
                "Size определяет количество процессов в коммуникаторе."
            ],
            [
                "11. Size",
                "Size is the number of processes in a communicator."
            ]
        ],

        [
            [
                "12. Root және Worker",
                "Root — белгілі бір операцияның негізгі процесі. Көбінесе 0-ранг root ретінде таңдалады. Worker — басқа есептеуші процестер. Бірақ MPI-де кез келген жарамды ранг негізгі процесс ретінде таңдалуы мүмкін."
            ],
            [
                "12. Root и Worker",
                "Root — выбранный главный процесс операции. Остальные процессы могут выполнять роль рабочих."
            ],
            [
                "12. Root and Worker",
                "The root is the selected process for an operation. Other processes may act as workers."
            ]
        ],

        [
            [
                "13. MPI_COMM_WORLD",
                "MPI_COMM_WORLD — қалыпты MPI бағдарламасында бастапқы іске қосылған барлық процестерді біріктіретін стандартты коммуникатор. Процестер осы ортада бір-бірімен байланыса алады."
            ],
            [
                "13. MPI_COMM_WORLD",
                "Стандартный коммуникатор, включающий процессы первоначального запуска MPI."
            ],
            [
                "13. MPI_COMM_WORLD",
                "The standard communicator containing the initially launched MPI processes."
            ]
        ],

        [
            [
                "14. MPI_Init",
                "MPI_Init(&argc, &argv) — MPI жұмыс ортасын іске қосатын функция. Негізгі MPI байланыс операцияларын қолданбас бұрын MPI инициализациялануы керек."
            ],
            [
                "14. MPI_Init",
                "Функция инициализации среды MPI перед использованием основных коммуникационных операций."
            ],
            [
                "14. MPI_Init",
                "Initializes the MPI environment."
            ]
        ],

        [
            [
                "15. MPI_Finalize",
                "MPI_Finalize() — MPI жұмысын аяқтайтын функция. Бағдарламаның қалыпты аяқталуы кезінде барлық қатысушы процестер оны шақырады."
            ],
            [
                "15. MPI_Finalize",
                "Функция завершения работы MPI."
            ],
            [
                "15. MPI_Finalize",
                "Finalizes the MPI environment."
            ]
        ],

        [
            [
                "16. MPI_Comm_rank",
                "MPI_Comm_rank(MPI_COMM_WORLD, &rank) ағымдағы процестің нөмірін rank айнымалысына жазады. Мысалы, үшінші процестің рангі 2 болады."
            ],
            [
                "16. MPI_Comm_rank",
                "Записывает ранг текущего процесса в указанную переменную."
            ],
            [
                "16. MPI_Comm_rank",
                "Returns the rank of the calling process."
            ]
        ],

        [
            [
                "17. MPI_Comm_size",
                "MPI_Comm_size(MPI_COMM_WORLD, &size) коммуникатордағы процестердің жалпы санын анықтайды."
            ],
            [
                "17. MPI_Comm_size",
                "Определяет количество процессов в коммуникаторе."
            ],
            [
                "17. MPI_Comm_size",
                "Returns the number of processes in a communicator."
            ]
        ],

        [
            [
                "18. MPI бағдарламасын іске қосу",
                "mpic++ main.cpp -o main командасы MPI бағдарламасын компиляциялайды. mpiexec -n 4 ./main командасы төрт процесс іске қосады. Бұл командалар MPI ортасы орнатылған Linux жүйесіне арналған мысал."
            ],
            [
                "18. Запуск MPI",
                "mpic++ main.cpp -o main компилирует программу, а mpiexec -n 4 ./main запускает четыре процесса."
            ],
            [
                "18. Running MPI",
                "Compile with mpic++ main.cpp -o main and launch four processes using mpiexec -n 4 ./main."
            ]
        ],

        [
            [
                "19. Programming Taskbook дегеніміз не?",
                "Programming Taskbook — бағдарламалау тапсырмаларын орындауға және тексеруге арналған оқу жүйесі. PT for MPI нұсқасы әр процеске бастапқы деректер беріп, алынған нәтижелердің дұрыстығын тексереді."
            ],
            [
                "19. Programming Taskbook",
                "Учебная система, предоставляющая исходные данные и проверяющая результаты программ."
            ],
            [
                "19. Programming Taskbook",
                "An educational system that supplies exercise inputs and checks program outputs."
            ]
        ]

    ]);

    // ==========================================
    // 2-МОДУЛЬ. ХАБАР АЛМАСУ
    // ==========================================

    addTheory(2, [

        [
            [
                "1. Хабарлама дегеніміз не?",
                "Хабарлама — бір процестен екінші процеске жіберілетін деректер. Ол бүтін сан, нақты сан, символ немесе массив болуы мүмкін. Мысалы, P0 процесі 25 санын P1 процесіне жібереді."
            ],
            [
                "1. Сообщение",
                "Данные, передаваемые от одного процесса другому."
            ],
            [
                "1. Message",
                "Data transferred from one process to another."
            ]
        ],

        [
            [
                "2. Sender және Receiver",
                "Sender — деректі жіберуші процесс. Receiver — деректі қабылдаушы процесс. P0 → P1 мысалында P0 жіберуші, P1 қабылдаушы болады."
            ],
            [
                "2. Отправитель и получатель",
                "Sender отправляет данные, Receiver принимает их."
            ],
            [
                "2. Sender and receiver",
                "The sender transmits data, while the receiver accepts it."
            ]
        ],

        [
            [
                "3. Point-to-point communication",
                "Екі процесс арасындағы тікелей хабар алмасу. Мысалы, P0 тек P2 процесіне хабарлама жібереді. Қалған процестер бұл алмасуға қатыспайды."
            ],
            [
                "3. Двухточечный обмен",
                "Прямой обмен сообщениями между двумя процессами."
            ],
            [
                "3. Point-to-point communication",
                "Direct communication between two processes."
            ]
        ],

        [
            [
                "4. Буфер дегеніміз не?",
                "Буфер — деректерді жіберу немесе қабылдау үшін пайдаланылатын жады аймағы. Мысалы, int number = 15 айнымалысы жіберу буфері ретінде қолданыла алады."
            ],
            [
                "4. Буфер",
                "Область памяти для отправляемых или принимаемых данных."
            ],
            [
                "4. Buffer",
                "A memory region used for sending or receiving data."
            ]
        ],

        [
            [
                "5. MPI_Send",
                "MPI_Send(&x, 1, MPI_INT, 1, 0, MPI_COMM_WORLD) функциясы x бүтін санын 1-рангті процеске жібереді. Мұндағы 1 — элемент саны, MPI_INT — тип, келесі 1 — қабылдаушы ранг, 0 — хабарлама белгісі."
            ],
            [
                "5. MPI_Send",
                "Отправляет сообщение указанному процессу."
            ],
            [
                "5. MPI_Send",
                "Sends a message to a specified destination rank."
            ]
        ],

        [
            [
                "6. MPI_Recv",
                "MPI_Recv(&x, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE) функциясы 0-рангтен бір бүтін сан қабылдайды және оны x айнымалысына сақтайды."
            ],
            [
                "6. MPI_Recv",
                "Принимает сообщение и сохраняет его в буфер."
            ],
            [
                "6. MPI_Recv",
                "Receives a matching message into a buffer."
            ]
        ],

        [
            [
                "7. Tag — хабарлама белгісі",
                "Tag — хабарламаларды ажыратуға арналған бүтін сан. Мысалы, температураға tag = 10, қысымға tag = 20 беруге болады. Қабылдаушы қажетті хабарламаны сәйкес белгі арқылы таңдайды."
            ],
            [
                "7. Tag",
                "Целочисленная метка для различения сообщений."
            ],
            [
                "7. Tag",
                "An integer label used to distinguish messages."
            ]
        ],

        [
            [
                "8. MPI_ANY_SOURCE",
                "MPI_ANY_SOURCE қабылдаушыға коммуникатордағы кез келген жарамды жіберушіден сәйкес хабарламаны алуға мүмкіндік береді."
            ],
            [
                "8. MPI_ANY_SOURCE",
                "Позволяет принять сообщение от любого подходящего отправителя."
            ],
            [
                "8. MPI_ANY_SOURCE",
                "Allows a receive operation to match any sender."
            ]
        ],

        [
            [
                "9. MPI_ANY_TAG",
                "MPI_ANY_TAG хабарламаның нақты белгісін алдын ала білмей қабылдауға мүмкіндік береді."
            ],
            [
                "9. MPI_ANY_TAG",
                "Позволяет принять сообщение с любой меткой."
            ],
            [
                "9. MPI_ANY_TAG",
                "Allows a receive operation to match any tag."
            ]
        ],

        [
            [
                "10. MPI_Status",
                "MPI_Status — қабылданған хабарлама туралы ақпарат сақтайтын құрылым. MPI_SOURCE жіберушінің рангін, MPI_TAG хабарламаның белгісін анықтауға мүмкіндік береді."
            ],
            [
                "10. MPI_Status",
                "Структура с информацией об источнике и метке принятого сообщения."
            ],
            [
                "10. MPI_Status",
                "Contains information about a received message."
            ]
        ],

        [
            [
                "11. Блоктаушы операциялар",
                "Блоктаушы MPI_Send және MPI_Recv функциялары белгілі бір аяқталу шарты орындалғанша басқаруды қайтармайды. MPI_Send аяқталғаннан кейін жіберу буферін қайта пайдалануға болады. MPI_Recv аяқталғанда қабылданған дерек дайын болады."
            ],
            [
                "11. Блокирующие операции",
                "Возвращают управление после выполнения соответствующих условий завершения операции."
            ],
            [
                "11. Blocking operations",
                "Return only after the relevant completion conditions have been satisfied."
            ]
        ],

        [
            [
                "12. Блоктамайтын операциялар",
                "MPI_Isend және MPI_Irecv байланыс операциясын бастайды да, бағдарламаның басқа есептеулерді орындауына мүмкіндік береді. Операцияның аяқталғанын MPI_Wait немесе MPI_Test арқылы тексеру қажет."
            ],
            [
                "12. Неблокирующие операции",
                "MPI_Isend и MPI_Irecv начинают обмен, позволяя продолжать вычисления. Завершение проверяется отдельно."
            ],
            [
                "12. Nonblocking operations",
                "MPI_Isend and MPI_Irecv initiate communication. Completion is checked separately."
            ]
        ],

        [
            [
                "13. Deadlock дегеніміз не?",
                "Deadlock — процестер бір-бірін күтіп, жұмысын жалғастыра алмай қалатын жағдай. Мысалы, екі процесс те алдымен MPI_Recv шақырып, ешқайсысы дерек жібермесе, екеуі де күтіп қалады."
            ],
            [
                "13. Deadlock",
                "Взаимная блокировка, когда процессы ожидают действий друг друга."
            ],
            [
                "13. Deadlock",
                "A situation where processes cannot proceed because they wait for each other."
            ]
        ],

        [
            [
                "14. MPI_Sendrecv",
                "MPI_Sendrecv бір шақыруда хабарлама жіберу және қабылдау операцияларын ұйымдастырады. Ол процестердің өзара дерек алмасуын жеңілдетеді және кейбір өзара блокталу жағдайларын болдырмауға көмектеседі."
            ],
            [
                "14. MPI_Sendrecv",
                "Объединяет отправку и приём сообщений в одном вызове."
            ],
            [
                "14. MPI_Sendrecv",
                "Combines a send and receive operation in one call."
            ]
        ]

    ]);

    // ==========================================
    // 3-МОДУЛЬ. РЕДУКЦИЯ ЖӘНЕ ДЕРЕКТЕР
    // ==========================================

    addTheory(3, [

        [
            [
                "1. Айнымалы дегеніміз не?",
                "Айнымалы — белгілі бір мән сақталатын жады бөлігі. Мысалы, int x = 10 бүтін санды, double y = 2.5 нақты санды сақтайды."
            ],
            [
                "1. Переменная",
                "Именованная область хранения значения."
            ],
            [
                "1. Variable",
                "A named storage location containing a value."
            ]
        ],

        [
            [
                "2. Массив дегеніміз не?",
                "Массив — бір типтегі бірнеше элементтің реттелген жиынтығы. Мысалы, [10, 20, 30, 40]. C++ тілінде массив элементтерінің индекстері 0-ден басталады."
            ],
            [
                "2. Массив",
                "Упорядоченный набор элементов одного типа."
            ],
            [
                "2. Array",
                "An ordered collection of elements of the same type."
            ]
        ],

        [
            [
                "3. MPI деректер типтері",
                "MPI_INT бүтін сандарды, MPI_FLOAT float типін, MPI_DOUBLE double типін, MPI_CHAR символдарды тасымалдауға арналған. Жіберу және қабылдау кезінде деректер типтері сәйкес келуі қажет."
            ],
            [
                "3. Типы MPI",
                "MPI_INT, MPI_FLOAT, MPI_DOUBLE и MPI_CHAR соответствуют основным типам данных."
            ],
            [
                "3. MPI datatypes",
                "MPI_INT, MPI_FLOAT, MPI_DOUBLE and MPI_CHAR represent basic data types."
            ]
        ],

        [
            [
                "4. Редукция дегеніміз не?",
                "Редукция — бірнеше процестегі мәндерді белгілі бір математикалық операция арқылы біріктіру. Мысалы, P0 = 10, P1 = 20, P2 = 30 болса, қосынды редукциясының нәтижесі 60 болады."
            ],
            [
                "4. Редукция",
                "Объединение значений нескольких процессов с помощью операции."
            ],
            [
                "4. Reduction",
                "Combining values from multiple processes using an operation."
            ]
        ],

        [
            [
                "5. MPI_SUM",
                "MPI_SUM — мәндерді қосу операциясы. Мысалы: 10 + 20 + 30 = 60."
            ],
            [
                "5. MPI_SUM",
                "Операция суммирования значений."
            ],
            [
                "5. MPI_SUM",
                "Adds values together."
            ]
        ],

        [
            [
                "6. MPI_MAX",
                "MPI_MAX — ең үлкен мәнді анықтайды. Мысалы, 10, 40, 25 сандарының максимумы 40."
            ],
            [
                "6. MPI_MAX",
                "Определяет максимальное значение."
            ],
            [
                "6. MPI_MAX",
                "Finds the maximum value."
            ]
        ],

        [
            [
                "7. MPI_MIN",
                "MPI_MIN — ең кіші мәнді анықтайды. Мысалы, 10, 40, 25 сандарының минимумы 10."
            ],
            [
                "7. MPI_MIN",
                "Определяет минимальное значение."
            ],
            [
                "7. MPI_MIN",
                "Finds the minimum value."
            ]
        ],

        [
            [
                "8. MPI_PROD",
                "MPI_PROD — мәндердің көбейтіндісін есептейді. Мысалы, 2 × 3 × 4 = 24."
            ],
            [
                "8. MPI_PROD",
                "Вычисляет произведение значений."
            ],
            [
                "8. MPI_PROD",
                "Multiplies values together."
            ]
        ],

        [
            [
                "9. MPI_Reduce",
                "MPI_Reduce барлық қатысушы процестердің деректерін біріктіреді және нәтижені таңдалған root процесіне береді. Мысалы, төрт процестің 10, 20, 30, 40 мәндерінің қосындысы P0 процесінде 100 болады."
            ],
            [
                "9. MPI_Reduce",
                "Объединяет данные процессов и передаёт результат корневому процессу."
            ],
            [
                "9. MPI_Reduce",
                "Combines process values and returns the result to the root."
            ]
        ],

        [
            [
                "10. MPI_Allreduce",
                "MPI_Allreduce редукция нәтижесін барлық қатысушы процеске береді. Егер қосынды 100 болса, P0, P1, P2 және P3 процестерінің әрқайсысы 100 нәтижесін алады."
            ],
            [
                "10. MPI_Allreduce",
                "Возвращает результат редукции всем процессам."
            ],
            [
                "10. MPI_Allreduce",
                "Returns the reduction result to every participating process."
            ]
        ],

        [
            [
                "11. MPI_MAXLOC",
                "MPI_MAXLOC ең үлкен мәнді және оған сәйкес орналасу индексін анықтайды. Егер мәнмен бірге процесс рангі берілсе, нәтиже ең үлкен сан мен оның рангінен тұрады. Бірдей максимумдар болса, кіші индекс таңдалады."
            ],
            [
                "11. MPI_MAXLOC",
                "Определяет максимум и соответствующий индекс. При равенстве выбирает меньший индекс."
            ],
            [
                "11. MPI_MAXLOC",
                "Returns the maximum value and its associated location, choosing the smaller location for ties."
            ]
        ],

        [
            [
                "12. MPI_Scan",
                "MPI_Scan жинақталған редукцияны есептейді. Мысалы, мәндер 10, 20, 30, 40 және операция MPI_SUM болса, нәтижелер тиісінше 10, 30, 60, 100 болады."
            ],
            [
                "12. MPI_Scan",
                "Выполняет префиксную редукцию по рангам."
            ],
            [
                "12. MPI_Scan",
                "Performs an inclusive prefix reduction over ranks."
            ]
        ],

        [
            [
                "13. Құрылым — struct",
                "Struct — әртүрлі типтегі деректерді бір объектіге біріктіреді. Мысалы, студенттің ID нөмірін int, орташа бағасын double, тобын char арқылы сақтауға болады."
            ],
            [
                "13. Структура",
                "Позволяет объединять поля различных типов."
            ],
            [
                "13. Structure",
                "Groups fields of different data types."
            ]
        ],

        [
            [
                "14. Құрама MPI типі",
                "Құрама MPI типі бірнеше элементтен немесе құрылым өрістерінен тұратын деректердің жадыдағы орналасуын сипаттайды. Ол күрделі деректерді бір хабарлама ретінде жіберуге мүмкіндік береді."
            ],
            [
                "14. Производный тип MPI",
                "Описывает составное расположение данных в памяти."
            ],
            [
                "14. Derived MPI datatype",
                "Describes a composite data layout in memory."
            ]
        ],

        [
            [
                "15. MPI_Type_commit және MPI_Type_free",
                "MPI_Type_commit жасалған MPI типін байланыс операцияларында қолдануға дайындайды. MPI_Type_free қажет болмай қалған тип объектісін босатады."
            ],
            [
                "15. MPI_Type_commit и MPI_Type_free",
                "Подготавливают созданный тип к использованию и освобождают его."
            ],
            [
                "15. MPI_Type_commit and MPI_Type_free",
                "Commit a derived datatype for use and release it when no longer needed."
            ]
        ],

        [
            [
                "16. MPI_Pack және MPI_Unpack",
                "MPI_Pack бірнеше деректі ортақ буферге жинақтайды. MPI_Unpack сол буферден деректерді сәйкес типтері мен реті бойынша қайта шығарады."
            ],
            [
                "16. MPI_Pack и MPI_Unpack",
                "Упаковывают данные в буфер и извлекают их обратно."
            ],
            [
                "16. MPI_Pack and MPI_Unpack",
                "Pack data into a buffer and unpack it again."
            ]
        ]

    ]);

    // ==========================================
    // 4-МОДУЛЬ. ҰЖЫМДЫҚ ОПЕРАЦИЯЛАР
    // ==========================================

    addTheory(4, [

        [
            [
                "1. Ұжымдық операция дегеніміз не?",
                "Ұжымдық операция — коммуникатордағы барлық қатысушы процесс орындайтын байланыс операциясы. Мысалы, барлық процеске бір дерек тарату немесе барлық процестің нәтижесін жинау."
            ],
            [
                "1. Коллективная операция",
                "Операция, в которой участвуют все процессы коммуникатора."
            ],
            [
                "1. Collective operation",
                "An operation involving all processes in a communicator."
            ]
        ],

        [
            [
                "2. MPI_Bcast — деректерді тарату",
                "Broadcast бір root процесіндегі деректі барлық басқа процеске таратады. Мысалы, P0-де 50 саны болса, операциядан кейін P1, P2 және P3 те 50 санын алады."
            ],
            [
                "2. MPI_Bcast",
                "Рассылает данные корневого процесса всем участникам."
            ],
            [
                "2. MPI_Bcast",
                "Broadcasts root data to all participating processes."
            ]
        ],

        [
            [
                "3. MPI_Scatter — бөліп тарату",
                "Scatter бастапқы массивті тең бөліктерге бөліп, процестерге таратады. Мысалы, P0-дегі [10, 20, 30, 40] массивінен төрт процесс бір элементтен алады."
            ],
            [
                "3. MPI_Scatter",
                "Распределяет равные части массива между процессами."
            ],
            [
                "3. MPI_Scatter",
                "Distributes equal-sized data blocks among processes."
            ]
        ],

        [
            [
                "4. MPI_Gather — деректерді жинау",
                "Gather барлық процестегі деректерді root процесіне жинайды. Мысалы, P0 = 10, P1 = 20, P2 = 30 болса, P0 нәтижесінде [10, 20, 30] массивін алады."
            ],
            [
                "4. MPI_Gather",
                "Собирает данные всех процессов на корневом процессе."
            ],
            [
                "4. MPI_Gather",
                "Collects process data at the root."
            ]
        ],

        [
            [
                "5. MPI_Allgather",
                "Allgather барлық процестің деректерін жинайды және толық нәтижені әр процеске береді. Gather-ден айырмашылығы — жинақталған массив тек root-та емес, барлық қатысушыда болады."
            ],
            [
                "5. MPI_Allgather",
                "Собирает данные и возвращает полный результат каждому процессу."
            ],
            [
                "5. MPI_Allgather",
                "Collects data and distributes the complete result to every process."
            ]
        ],

        [
            [
                "6. MPI_Alltoall",
                "Alltoall операциясында әр процесс қалған процестердің әрқайсысына, соның ішінде өзіне де, жеке дерек бөлігін береді. Бұл барлық процестер арасында толық дерек алмасуды ұйымдастырады."
            ],
            [
                "6. MPI_Alltoall",
                "Каждый процесс обменивается отдельными блоками данных со всеми процессами."
            ],
            [
                "6. MPI_Alltoall",
                "Every process exchanges distinct data blocks with every process."
            ]
        ],

        [
            [
                "7. MPI_Barrier",
                "Barrier — процестерді синхрондау операциясы. Барлық қатысушы осы функцияға жетпейінше, олардың ешқайсысы одан әрі өте алмайды."
            ],
            [
                "7. MPI_Barrier",
                "Барьер синхронизации всех процессов коммуникатора."
            ],
            [
                "7. MPI_Barrier",
                "Synchronizes all participating processes."
            ]
        ],

        [
            [
                "8. Синхрондау дегеніміз не?",
                "Синхрондау — бірнеше процестің жұмысын үйлестіру. Мысалы, барлық процесс есептеудің бірінші кезеңін аяқтағаннан кейін ғана екінші кезеңге өтеді."
            ],
            [
                "8. Синхронизация",
                "Согласование выполнения операций нескольких процессов."
            ],
            [
                "8. Synchronization",
                "Coordination of execution across multiple processes."
            ]
        ],

        [
            [
                "9. MPI_Comm_split",
                "MPI_Comm_split бастапқы коммуникатордағы процестерді color мәні бойынша топтарға бөледі. Key мәні жаңа топтағы рангтердің ретін анықтауға қатысады. Мысалы, жұп және тақ рангтерді екі бөлек коммуникаторға бөлуге болады."
            ],
            [
                "9. MPI_Comm_split",
                "Разделяет коммуникатор на группы по параметру color."
            ],
            [
                "9. MPI_Comm_split",
                "Splits a communicator into subgroups based on color and orders ranks using key."
            ]
        ],

        [
            [
                "10. MPI_Comm_dup",
                "MPI_Comm_dup бұрынғы коммуникатордағы процестер тобын сақтап, бөлек байланыс контексті бар жаңа коммуникатор жасайды."
            ],
            [
                "10. MPI_Comm_dup",
                "Создаёт копию коммуникатора с отдельным контекстом связи."
            ],
            [
                "10. MPI_Comm_dup",
                "Duplicates a communicator with a separate communication context."
            ]
        ],

        [
            [
                "11. MPI_COMM_NULL",
                "MPI_COMM_NULL — жарамды коммуникатор объектісінің жоқ екенін білдіретін арнайы мән. Оны қалыпты хабар алмасу операцияларында коммуникатор ретінде қолдануға болмайды."
            ],
            [
                "11. MPI_COMM_NULL",
                "Специальное значение отсутствующего коммуникатора."
            ],
            [
                "11. MPI_COMM_NULL",
                "A special value representing no valid communicator."
            ]
        ],

        [
            [
                "12. MPI_Comm_free",
                "MPI_Comm_free пайдаланылмайтын, бағдарлама өзі құрған коммуникаторды босату үшін қолданылады. MPI_COMM_WORLD сияқты алдын ала анықталған коммуникаторларды босатуға болмайды."
            ],
            [
                "12. MPI_Comm_free",
                "Освобождает созданный пользователем коммуникатор."
            ],
            [
                "12. MPI_Comm_free",
                "Releases a user-created communicator."
            ]
        ]

    ]);

    // ==========================================
    // 5-МОДУЛЬ. ВИРТУАЛДЫ ТОПОЛОГИЯЛАР
    // ==========================================

    addTheory(5, [

        [
            [
                "1. Топология дегеніміз не?",
                "Топология — жүйе элементтерінің өзара байланысу құрылымы. Мысалы, сызықтық, сақина, тор және граф құрылымдары."
            ],
            [
                "1. Топология",
                "Структура взаимосвязей между элементами системы."
            ],
            [
                "1. Topology",
                "The structure of connections between system elements."
            ]
        ],

        [
            [
                "2. MPI виртуалды топологиясы",
                "MPI виртуалды топологиясы процестер арасындағы логикалық көршілік құрылымын сипаттайды. Ол компьютерлердің нақты физикалық жалғануын өзгертпейді."
            ],
            [
                "2. Виртуальная топология MPI",
                "Логическая организация соседства процессов."
            ],
            [
                "2. MPI virtual topology",
                "A logical organization of process connectivity."
            ]
        ],

        [
            [
                "3. Сызықтық топология",
                "Процестер бір қатарға орналасады: P0 — P1 — P2 — P3. Әр ішкі процестің сол және оң жағында көршісі болады."
            ],
            [
                "3. Линейная топология",
                "Процессы логически расположены в одной линии."
            ],
            [
                "3. Linear topology",
                "Processes are arranged in a logical line."
            ]
        ],

        [
            [
                "4. Сақиналы топология",
                "Сақиналы құрылымда соңғы процесс бірінші процеске көрші болады. P0 — P1 — P2 — P3 — P0. Бұл циклдік дерек алмасуға ыңғайлы."
            ],
            [
                "4. Кольцевая топология",
                "Последний процесс связан с первым, образуя кольцо."
            ],
            [
                "4. Ring topology",
                "The last and first processes are connected to form a ring."
            ]
        ],

        [
            [
                "5. Торлық топология",
                "Процестер жолдар мен бағандардан тұратын логикалық торға орналасады. Мысалы, 2 × 3 торда алты процесс болады. Әр процесс координаталары арқылы анықталады."
            ],
            [
                "5. Топология решётки",
                "Процессы организованы в строки и столбцы."
            ],
            [
                "5. Grid topology",
                "Processes are organized in rows and columns."
            ]
        ],

        [
            [
                "6. Графтық топология",
                "Граф төбелер мен қырлардан тұрады. MPI-де төбелер процестерді, қырлар логикалық көршілік байланыстарын білдіреді."
            ],
            [
                "6. Графовая топология",
                "Процессы являются вершинами графа, а рёбра задают соседство."
            ],
            [
                "6. Graph topology",
                "Processes are graph vertices, and edges represent logical adjacency."
            ]
        ],

        [
            [
                "7. MPI_Dims_create",
                "MPI_Dims_create процестер санын берілген өлшемдер бойынша торға ыңғайлы етіп бөлуге көмектеседі. Мысалы, алты процесті 3 × 2 торға ұйымдастыруға болады."
            ],
            [
                "7. MPI_Dims_create",
                "Подбирает размеры декартовой решётки."
            ],
            [
                "7. MPI_Dims_create",
                "Helps choose dimensions for a Cartesian grid."
            ]
        ],

        [
            [
                "8. MPI_Cart_create",
                "MPI_Cart_create декарттық топологиясы бар жаңа коммуникатор жасайды. Оның параметрлері тор өлшемдерін, периодтылықты және рангтерді қайта реттеуге рұқсатты анықтайды."
            ],
            [
                "8. MPI_Cart_create",
                "Создаёт коммуникатор с декартовой топологией."
            ],
            [
                "8. MPI_Cart_create",
                "Creates a communicator with Cartesian topology."
            ]
        ],

        [
            [
                "9. MPI_Cart_coords",
                "MPI_Cart_coords берілген процесс рангінің декарттық тордағы координаталарын анықтайды."
            ],
            [
                "9. MPI_Cart_coords",
                "Определяет координаты процесса по его рангу."
            ],
            [
                "9. MPI_Cart_coords",
                "Returns Cartesian coordinates for a process rank."
            ]
        ],

        [
            [
                "10. MPI_Cart_rank",
                "MPI_Cart_rank координаталары белгілі процестің декарттық коммуникатордағы рангін анықтайды."
            ],
            [
                "10. MPI_Cart_rank",
                "Определяет ранг процесса по координатам."
            ],
            [
                "10. MPI_Cart_rank",
                "Returns the process rank corresponding to Cartesian coordinates."
            ]
        ],

        [
            [
                "11. MPI_Cart_shift",
                "MPI_Cart_shift тордың таңдалған бағыты бойынша көршілес процестердің рангтерін анықтайды. Бұл көршілер арасында хабарлама алмасу үшін қолданылады."
            ],
            [
                "11. MPI_Cart_shift",
                "Определяет ранги соседних процессов в выбранном направлении."
            ],
            [
                "11. MPI_Cart_shift",
                "Identifies neighboring ranks along a Cartesian dimension."
            ]
        ],

        [
            [
                "12. MPI_PROC_NULL",
                "MPI_PROC_NULL — жоқ көршіні немесе дерек алмасуға қатыспайтын процесті білдіретін арнайы мән. Мысалы, периодты емес сызықтың шеткі процесінде бір көрші болмайды."
            ],
            [
                "12. MPI_PROC_NULL",
                "Специальное значение отсутствующего процесса."
            ],
            [
                "12. MPI_PROC_NULL",
                "A special value representing a nonexistent communication partner."
            ]
        ],

        [
            [
                "13. MPI_Graph_create",
                "MPI_Graph_create графтық топологиясы бар коммуникатор жасайды. Қандай процестердің логикалық көрші болатыны граф құрылымымен беріледі."
            ],
            [
                "13. MPI_Graph_create",
                "Создаёт коммуникатор с графовой топологией."
            ],
            [
                "13. MPI_Graph_create",
                "Creates a communicator with graph topology."
            ]
        ],

        [
            [
                "14. MPI_Graph_neighbors",
                "MPI_Graph_neighbors берілген рангке көршілес процестердің нөмірлерін анықтайды."
            ],
            [
                "14. MPI_Graph_neighbors",
                "Возвращает ранги соседей указанного процесса."
            ],
            [
                "14. MPI_Graph_neighbors",
                "Returns the ranks of a process's graph neighbors."
            ]
        ]

    ]);

    console.log(
        "MPI SIGNAL PRO: кеңейтілген теория жүктелді!"
    );

})();
