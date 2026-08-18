<template>
  <div class="max-w-4xl mx-auto">
    <!-- Cabeçalho com logo ConectaVidas -->
    <div class="mb-6 flex flex-col items-center text-center">
      <img
        src="/icons/logo-claro.png"
        alt="ConectaVidas"
        class="h-20 w-auto"
      />
      <h1 class="text-xl sm:text-2xl font-bold text-body-strong mt-2">Termos e Políticas</h1>
      <p class="text-body-muted text-sm mt-1">
        Leia atentamente o contrato antes de confirmar sua concordância.
      </p>
    </div>

    <!-- Seletor de documento -->
    <div class="flex items-center justify-center gap-2 mb-6 p-1 bg-gray-100 rounded-lg shadow-inner w-full sm:w-fit sm:mx-auto">
      <button
        type="button"
        class="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors"
        :class="activeDoc === 'humana'
          ? 'bg-white text-primary shadow'
          : 'text-gray-500 hover:text-gray-700'"
        @click="activeDoc = 'humana'"
      >
        Telemedicina Humana
      </button>
      <button
        type="button"
        class="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors"
        :class="activeDoc === 'vet'
          ? 'bg-white text-primary shadow'
          : 'text-gray-500 hover:text-gray-700'"
        @click="activeDoc = 'vet'"
      >
        Telemedicina Veterinária
      </button>
    </div>

    <!-- Documento -->
    <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <div class="bg-gray-50 border-b border-gray-200 px-4 sm:px-5 py-3 flex items-center gap-2 text-gray-600 text-sm font-medium">
        <UIcon name="i-heroicons-document-text" class="size-5 text-primary shrink-0" />
        <span class="truncate">{{ activeDocData.heading }}</span>
      </div>

      <div class="terms-doc max-h-[70vh] overflow-y-auto px-5 sm:px-8 py-6">
        <p class="text-xs uppercase tracking-wide text-gray-400 mb-6">
          {{ activeDocData.updatedAt }}
        </p>

        <section
          v-for="(clause, ci) in activeDocData.clauses"
          :key="ci"
          class="mb-7 last:mb-0"
        >
          <h2 class="terms-clause-title">{{ clause.title }}</h2>
          <template v-for="(item, ii) in clause.items" :key="ii">
            <p class="terms-item">{{ item.text }}</p>
            <ul v-if="item.sub" class="terms-sublist">
              <li v-for="(sub, si) in item.sub" :key="si">{{ sub }}</li>
            </ul>
          </template>
        </section>

        <p class="terms-closing">{{ activeDocData.closing }}</p>
      </div>
    </div>

    <!-- Área de confirmação -->
    <div
      class="mt-6 rounded-2xl border p-4 sm:p-5 transition-colors"
      :class="agreed ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'"
    >
      <label class="flex items-start gap-3 cursor-pointer select-none group">
        <div class="mt-0.5 shrink-0">
          <input
            v-model="agreed"
            type="checkbox"
            class="sr-only"
          />
          <div
            class="size-5 rounded border-2 flex items-center justify-center transition-all"
            :class="agreed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 bg-white group-hover:border-primary'"
          >
            <UIcon
              v-if="agreed"
              name="i-heroicons-check"
              class="size-3.5 text-white"
            />
          </div>
        </div>
        <span class="text-body text-sm leading-relaxed">
          Li e estou de acordo com os
          <strong class="text-primary">Termos e Políticas</strong>
          da ConectaVidas, incluindo as condições de uso dos serviços de telemedicina humana e veterinária.
        </span>
      </label>

      <!-- Botão de confirmação -->
      <div class="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <UButton
          :disabled="!agreed"
          :loading="confirming"
          :color="confirmed ? 'success' : 'primary'"
          size="lg"
          class="transition-all justify-center"
          block
          @click="handleConfirm"
        >
          <template #leading>
            <UIcon
              :name="confirmed ? 'i-heroicons-check-badge' : 'i-heroicons-shield-check'"
              class="size-5"
            />
          </template>
          {{ confirmed ? 'Confirmado! ✓' : 'Confirmar concordância' }}
        </UButton>

        <span
          v-if="confirmed"
          class="text-green-600 text-sm font-medium flex items-center gap-1.5"
        >
          <UIcon name="i-heroicons-check-circle" class="size-4" />
          Concordância registrada
        </span>
      </div>

      <!-- Mensagem de aviso se não aceitou -->
      <p
        v-if="!agreed && showWarning"
        class="mt-3 text-amber-600 text-xs flex items-center gap-1.5"
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="size-4 shrink-0" />
        Marque a caixa acima para confirmar que leu e concordou com os termos.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TermItem {
  text: string
  sub?: string[]
}
interface Clause {
  title: string
  items: TermItem[]
}
interface TermsDoc {
  heading: string
  updatedAt: string
  clauses: Clause[]
  closing: string
}

const termosHumana: TermsDoc = {
  heading: 'Termo de Consentimento Livre e Esclarecido e Contrato de Adesão — Telemedicina Humana',
  updatedAt: 'Atualizado em: 11 de julho de 2026',
  clauses: [
    {
      title: 'CLÁUSULA PRIMEIRA – DOS TERMOS DE USO E DA NATUREZA DOS SERVIÇOS',
      items: [
        { text: '1.1. A plataforma ConectaVidas consubstancia uma ferramenta digital destinada exclusivamente à prestação de serviços de telemedicina humana, intermediação de consultas médicas remotas e suporte de saúde digital para pacientes, operando por meio de aplicativos, sítios eletrônicos e canais de comunicação integrados.' },
        { text: '1.2. Ao proceder com o cadastro, acesso ou utilização de qualquer funcionalidade ou serviço vinculado à ConectaVidas, o Paciente ou seu Responsável Legal declara, para todos os fins de direito, ter efetuado a leitura integral, compreendido e manifestado sua concordância irrestrita com os termos expostos no presente instrumento.' },
        { text: '1.3. O Paciente declara plena ciência de que os serviços remotos oferecidos pela ConectaVidas não substituem, sob nenhuma hipótese, o atendimento presencial de urgência ou emergência médica imediata.' },
        {
          text: '1.4. O usuário, ao aderir ao presente termo, atesta e obriga-se às seguintes condições:',
          sub: [
            'I. Prestar informações fidedignas, completas, exatas e atualizadas acerca de seus dados cadastrais e de seu histórico clínico e de saúde;',
            'II. Declarar plena ciência e compreensão acerca das limitações técnicas e científicas intrínsecas ao atendimento médico remoto;',
            'III. Utilizar as ferramentas tecnológicas disponibilizadas pautando-se por preceitos éticos, legais, de boa-fé e de mútuo respeito.',
          ],
        },
      ],
    },
    {
      title: 'CLÁUSULA SEGUNDA – DA POLÍTICA DE PRIVACIDADE, PROTEÇÃO DE DADOS (LGPD) E SIGILO MÉDICO',
      items: [
        { text: '2.1. A plataforma ConectaVidas realiza o tratamento de dados pessoais e dados pessoais sensíveis (dados de saúde) em estrita observância aos ditames da Lei Geral de Proteção de Dados Pessoais (LGPD – Lei nº 13.709/2018), às diretrizes normativas do CFM e ao Código de Ética Médica regulador do sigilo profissional.' },
        {
          text: '2.2. Para a estrita execução das finalidades contratuais e assistenciais, serão coletados e processados os seguintes dados:',
          sub: [
            'I. Nome completo, número de telefone, Registro Geral (RG), CPF e endereço eletrônico (e-mail) do Paciente ou Responsável Legal;',
            'II. Histórico clínico, sintomas, anamnese, diagnósticos, alergias, tratamentos em curso e dados epidemiológicos;',
            'III. Receitas médicas, atestados, relatórios, laudos de exames complementares e mídias digitais de diagnóstico transferidos pelo Paciente;',
            'IV. Gravações, logs de acesso e metadados das interações em ambiente de telemedicina, necessários para a segurança jurídica do ato médico.',
          ],
        },
        { text: '2.3. Os dados coletados serão armazenados em ambiente digital seguro, criptografado e auditável que atenda integralmente aos requisitos de segurança, integridade e confidencialidade exigidos pela legislação federal (Lei nº 13.787/2018 - Digitalização de Prontuários), pelo CFM e pelos critérios da Infraestrutura de Chaves Públicas Brasileira (ICP-Brasil).' },
        { text: '2.4. Os dados relativos ao prontuário do Paciente serão mantidos sob guarda digital permanente ou pelo prazo mínimo legal de 20 (vinte) anos, nos termos do artigo 6º da Lei nº 13.787/2018 e normativas consolidadas do CFM.' },
        { text: '2.5. Para o exercício de quaisquer direitos afetos à privacidade, retificação ou esclarecimento de dúvidas sobre a proteção de dados, o usuário deverá contactar o Encarregado pelo Tratamento de Dados por meio do endereço eletrônico oficial: suporteconectavidas@gmail.com.' },
        {
          text: '2.6. Em razão da confidencialidade e do sigilo médico, o Paciente assume o compromisso de sigilo absoluto em relação aos atos de atendimento e conteúdos disponibilizados pela plataforma, aplicando-se as seguintes vedações:',
          sub: [
            'I. Fica terminantemente proibida a gravação, seja por áudio, vídeo ou captura de tela (print screen), de qualquer teleconsulta ou interação com os profissionais da plataforma, sem a autorização prévia, expressa e por escrito da ConectaVidas e do médico assistente;',
            'II. Resta expressamente proibida a divulgação, publicação, veiculação ou compartilhamento, em redes sociais, aplicativos de mensagens (como WhatsApp) ou mídias públicas e privadas, de trechos de atendimentos, receitas, laudos ou mídias dos profissionais de saúde parceiros.',
          ],
        },
      ],
    },
    {
      title: 'CLÁUSULA TERCEIRA – DA POLÍTICA DE TELEMEDICINA HUMANA E COMPATIBILIDADE COM AS DIRETRIZES DO CFM',
      items: [
        { text: '3.1. A prestação de serviços de saúde na modalidade remota pela ConectaVidas subordina-se de forma completa e obrigatória à Lei Federal nº 14.510/2022 (Lei da Telemedicina) e às normas expedidas pelo Conselho Federal de Medicina (CFM), em especial à Resolução CFM nº 2.314/2022, que define e regulamenta a telemedicina como forma de prestação de serviços médicos mediados por tecnologias de informação e comunicação.' },
        { text: '3.2. Nos termos do ordenamento civil e médico vigente, o atendimento via telemedicina compreende as modalidades de teleconsulta, teleconsultoria, telediagnóstico, televigilância, teletriagem e telemonitoramento, sendo rigorosamente resguardada a autonomia completa do médico na decisão de utilizar ou indicar o método remoto, conforme determina o artigo 4º da Resolução CFM nº 2.314/2022.' },
        {
          text: '3.3. O Paciente declara estar plenamente ciente das seguintes condicionantes técnicas da telemedicina humana:',
          sub: [
            'I. O ato médico à distância exige infraestrutura digital estável e que a eficácia diagnóstica depende umbilicalmente da clareza, veracidade e completude das informações relatadas pelo Paciente;',
            'II. A modalidade apresenta limitações físicas intrínsecas decorrentes da impossibilidade de realização do exame físico presencial imediato (palpação, percussão, ausculta física direta);',
            'III. O médico assistente possui total autonomia técnico-profissional para determinar que o caso clínico exige avaliação presencial, interrompendo o ato remoto e direcionando o Paciente para o serviço físico competente, sem que isso configure falha ou recusa de atendimento.',
          ],
        },
        { text: '3.4. Os documentos médicos emitidos no âmbito da plataforma (receitas, pedidos de exames, relatórios e atestados) serão assinados eletronicamente mediante a utilização do sistema de certificação em nuvem BirdID. Esta tecnologia de assinatura eletrônica qualificada é a mesma utilizada pelas maiores e melhores empresas do setor de saúde no Brasil, garantindo padrão-ouro de segurança e certificando que todos os documentos gerados e transmitidos serão plenamente válidos, autênticos e legalmente aceitos em todo o território nacional, em estrita conformidade com o artigo 6º da Resolução CFM nº 2.314/2022 e a Medida Provisória nº 2.200-2/2001.' },
      ],
    },
    {
      title: 'CLÁUSULA QUARTA – POLÍTICA DE CANCELAMENTO FINANCEIRO E DIREITO DE ARREPENDIMENTO',
      items: [
        { text: '4.1. Não assiste ao Paciente o direito ao reembolso ou estorno de valores relativos a consultas e teleorientações médicas que tenham sido comprovadamente executadas e disponibilizadas, salvo por indisponibilidade técnica sistêmica imputável exclusivamente à plataforma.' },
        { text: '4.2. Em estrita observância ao disposto no artigo 49 da Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor), assiste ao Paciente o direito de exercer o seu direito de arrependimento no prazo improrrogável de até 7 (sete) dias corridos a partir da assinatura de planos ou contratações, fazendo jus à restituição dos valores pagos, desde que não tenham sido usufruídos ou realizados atos médicos de telemedicina no referido período.' },
      ],
    },
    {
      title: 'CLÁUSULA QUINTA – POLÍTICA DE ASSINATURA, RECOMPOSIÇÃO DE PREÇOS ANUAL E FIDELIDADE',
      items: [
        { text: '5.1. Os planos de assinatura recorrente de suporte de saúde disponibilizados pela ConectaVidas possuem prazo de vigência mínima e fidelidade compulsória de 12 (doze) meses, computados a partir da data de adesão do usuário e aceite deste termo.' },
        { text: '5.2. Em observância ao princípio da estabilidade econômico-financeira do contrato, os valores das contraprestações pecuniárias dos planos de assinatura sofrerão recomposição e atualização inflacionária exclusivamente em caráter anual (a cada 12 meses), restando terminantemente vedada a imposição de reajustes ou alterações de preço no meio do período de vigência de uma anuidade em curso.' },
        { text: '5.3. O índice de reajuste anual de recomposição monetária tomará como base a variação acumulada de indicadores econômicos oficiais ou a flutuação da taxa básica de juros estruturais do Brasil (Taxa Selic / IPCA), refletindo o custo do serviço de saúde digital e os encargos de mercado.' },
        { text: '5.4. A ConectaVidas compromete-se a realizar a notificação prévia e formal acerca do percentual de atualização e do novo valor da assinatura com expressiva antecedência em relação à data da virada anual de ciclo do plano do usuário.' },
        { text: '5.5. Diante da comunicação do reajuste anual, assiste ao Paciente o direito de solicitar o cancelamento integral do seu plano de suporte sem a incidência de qualquer multa ou ônus por quebra de permanência, desde que a respectiva solicitação de rescisão seja formalizada pelo Paciente com a antecedência mínima de até 15 (quinze) dias antes da efetiva data da alteração e renovação do ciclo.' },
        { text: '5.6. Caso o Paciente não manifeste o seu pedido de cancelamento no prazo estipulado de 15 (quinze) dias anteriores à alteração anual de preços, a renovação do plano processar-se-á de forma automática sob as novas bases tarifárias informadas, iniciando-se imediatamente um novo período de fidelidade compulsória e permanência mínima de 12 (doze) meses, devendo o usuário continuar honrando regularmente as parcelas subsequentes até o final do novo ciclo contratual.' },
        { text: '5.7. A ocorrência de inadimplemento das obrigações financeiras por parte do usuário autorizará a ConectaVidas a suspender temporariamente o acesso à plataforma e aos agendamentos de rotina, procedendo à cobrança administrativa nos termos da lei.' },
      ],
    },
    {
      title: 'CLÁUSULA SEXTA – DAS DIRETRIZES OPERACIONAIS E DA EXCLUSIVIDADE DE AGENDAMENTO ANTECIPADO',
      items: [
        { text: '6.1. A prestação de serviços médicos e de telemedicina humana na plataforma ConectaVidas NÃO opera em regime de prontidão contínua ou plantão 24 horas. Todos os atendimentos clínicos remotos serão realizados EXCLUSIVAMENTE mediante agendamento prévio e antecipado pelo Paciente no sistema, condicionado à grade de horários disponibilizada pelos profissionais médicos parceiros.' },
        { text: '6.2. O suporte administrativo, operacional e de atendimento financeiro ao Paciente funcionará em dias úteis, no intervalo compreendido entre as 10h00 e as 18h00, por meio dos canais eletrônicos oficiais: e-mail suporteconectavidas@gmail.com e contato via telefone/WhatsApp (11) 97865-4921.' },
      ],
    },
    {
      title: 'CLÁUSULA SÉTIMA – DA RESTRITIVA REGULAMENTAÇÃO DE CANCELAMENTO PRÉVIO E RETENÇÃO POR AUSÊNCIA',
      items: [
        { text: '7.1. Em consonância com a boa-fé contratual e o equilíbrio da agenda médica, e considerando a inexistência de uma fixação de prazo mínimo compulsório em lei para desmarcações de consultas particulares eletivas, a plataforma estabelece que o cancelamento ou a alteração de um agendamento confirmado pelo Paciente deve ser formalizado com a antecedência mínima e obrigatória de 24 (vinte e quatro) horas em relação ao horário marcado.' },
        { text: '7.2. Fica expressamente estipulado que o cancelamento realizado fora do prazo fixado no item anterior ou o não comparecimento do Paciente à teleconsulta (no-show) no horário aprazado ensejará a retenção integral do valor pago pela consulta individual ou o cômputo do crédito da assinatura, como justa indenização pela reserva da hora profissional médica invisibilizada para outros pacientes, restando vedado o estorno, reembolso ou reagendamento sem ônus.' },
        { text: '7.3. Os atendimentos agendados observarão um limite de tolerância máximo de 10 (dez) minutos de atraso por parte do Paciente. Findo este período sem a conexão do usuário, configurar-se-á a ausência imotivada, aplicando-se integralmente a penalidade descrita no item 7.2.' },
      ],
    },
    {
      title: 'CLÁUSULA OITAVA – DA POLÍTICA DE EMERGÊNCIA E ENCAMINHAMENTO CRÍTICO IMPOSITIVO',
      items: [
        { text: '8.1. O PACIENTE DECLARA INTEGRAL CIÊNCIA DE QUE A PLATAFORMA CONECTAVIDAS NÃO SE DESTINA, SOB NENHUMA HIPÓTESE, AO ATENDIMENTO DE URGÊNCIAS OU EMERGÊNCIAS MÉDICAS. POR NÃO OPERAR EM PLANTÃO DE PRONTIDÃO OU CARÁTER DE RESGATE, A PLATAFORMA É RESTRITA A ATENDIMENTOS ELETIVOS PREVIAMENTE AGENDADOS.' },
        { text: '8.2. Diante da constatação ou suspeita de sinais clínicos indicativos de emergência médica grave (como dor torácica intensa, falta de ar severa, confusão mental súbita, perda de consciência, paralisias, sinais de AVC, hemorragias volumosas ou traumas severos), o Paciente deverá ABSTER-SE de aguardar ou agendar um atendimento remoto, competindo-lhe acionar imediatamente os serviços públicos ou privados de socorro médico emergencial (SAMU 192 / Corpo de Bombeiros 193) ou buscar o pronto-socorro hospitalar presencial mais próximo.' },
      ],
    },
    {
      title: 'CLÁUSULA NONA – DOS DEVERES DOS MÉDICOS PARCEIROS',
      items: [
        { text: '9.1. Os médicos cadastrados e atuantes por intermédio da plataforma ConectaVidas declaram formalmente possuir inscrição regular, ativa e sem impedimentos perante o Conselho Regional de Medicina (CRM) de sua respectiva jurisdição geográfica, além do respectivo Registro de Qualificação de Especialista (RQE), quando declarada atuação em área especializada, em estrita observância às regras de publicidade médica do CFM.' },
        { text: '9.2. Cada profissional médico responderá de forma individual, exclusiva, personalíssima e autônoma, nos âmbitos técnico, ético-profissional (perante o CRM) e civil, pelas decisões clínicas, diagnósticos, condutas, orientações e prescrições exaradas durante o ato médico remoto.' },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA – DA AUTORIZAÇÃO E DO USO LIMITADO DE DADOS INSTITUCIONAIS',
      items: [
        { text: '10.1. O Paciente outorga à ConectaVidas autorização para o uso exclusivo de dados de contato e imagens cadastrais estritamente para finalidades de comunicação institucional e suporte, sendo expressamente vedada a exibição de dados clínicos, imagens de consultas ou dados sensíveis em canais públicos de marketing sem consentimento específico e apartado, em estrita observância ao Código de Ética Médica e às resoluções de publicidade médica (Resolução CFM nº 2.336/2023).' },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA PRIMEIRA – DO CONSENTIMENTO INFORMADO E ACEITE PLENO',
      items: [
        { text: '11.1. O Paciente declara ter lido atentamente, compreendido na íntegra e aceitado, sem qualquer ressalva, todas as condições, limitações técnicas e obrigações jurídicas contidas neste instrumento, outorgando de forma livre o seu Consentimento Livre e Esclarecido exigido pelo CFM (artigo 5º da Resolução CFM nº 2.314/2022) para a realização de atos médicos baseados em telemedicina.' },
      ],
    },
  ],
  closing: 'Este termo está em estrito alinhamento com a Lei Federal nº 14.510/2022, a Resolução CFM nº 2.314/2022, a Lei nº 13.787/2018 e a Lei Geral de Proteção de Dados (LGPD). A sua aceitação digital confere plena validade jurídica e contratual às partes.',
}

const termosVet: TermsDoc = {
  heading: 'Termo de Consentimento Livre e Esclarecido e Contrato de Adesão — Telemedicina Veterinária',
  updatedAt: 'Atualizado em: 18 de maio de 2026',
  clauses: [
    {
      title: 'CLÁUSULA PRIMEIRA – DOS TERMOS DE USO E DA NATUREZA DOS SERVIÇOS',
      items: [
        { text: '1.1. A plataforma ConectaVidas consubstancia uma ferramenta digital destinada exclusivamente à prestação de serviços de teleorientação veterinária, intermediação de atendimentos e suporte remoto para tutores de animais, operando por meio de aplicativos, sítios eletrônicos, canais de comunicação digital (WhatsApp) ou plataformas correlatas.' },
        { text: '1.2. Ao proceder com o cadastro, acesso ou utilização de qualquer funcionalidade ou serviço vinculado à ConectaVidas, o usuário declara, para todos os fins de direito, ter efetuado a leitura integral, compreendido e manifestado sua concordância irrestrita com os termos expostos no presente instrumento.' },
        { text: '1.3. O Tutor declara plena ciência de que os serviços remotos oferecidos pela ConectaVidas não substituem, sob nenhuma hipótese, as consultas presenciais, exames físicos semiológicos, procedimentos cirúrgicos, internamentos ou quaisquer modalidades de atendimento emergencial imediato.' },
        {
          text: '1.4. O usuário, ao aderir ao presente termo, atesta e obriga-se às seguintes condições:',
          sub: [
            'I. Possuir capacidade civil plena, sendo maior de 18 (dezoito) anos nos termos da legislação vigente;',
            'II. Prestar informações fidedignas, completas, exatas e atualizadas acerca de seus dados cadastrais e do histórico clínico do animal;',
            'III. Declarar plena ciência e compreensão acerca das limitações técnicas e científicas intrínsecas à telemedicina veterinária;',
            'IV. Utilizar as ferramentas tecnológicas disponibilizadas pautando-se por preceitos éticos, legais, de boa-fé e mútuo respeito.',
          ],
        },
        { text: '1.5. A identificação de uso inadequado, abusivo, fraudulento ou ilegal da plataforma ensejará a imediata suspensão, limitação de acesso ou resilição unilateral definitiva da conta do usuário, sem prejuízo da adoção das medidas judiciais cíveis e criminais cabíveis.' },
      ],
    },
    {
      title: 'CLÁUSULA SEGUNDA – DA POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS (LGPD)',
      items: [
        { text: '2.1. A plataforma ConectaVidas realiza o tratamento de dados pessoais em estrita observância aos ditames da Lei Geral de Proteção de Dados Pessoais (LGPD – Lei nº 13.709/2018), adotando medidas de segurança aptas a resguardar a privacidade do usuário.' },
        {
          text: '2.2. Para a estrita execução das finalidades contratuais, serão coletados e processados os seguintes dados:',
          sub: [
            'I. Nome completo, número de telefone e endereço de correio eletrônico (e-mail) do Tutor;',
            'II. Cadastro de Pessoas Físicas (CPF), para fins de faturamento e obrigações fiscais;',
            'III. Dados de identificação do animal, histórico clínico, anamnese e informações médico-veterinárias fornecidas durante os atos de teleorientação;',
            'IV. Registros fotográficos, arquivos de vídeo, resultados de exames complementares e documentos correlatos transferidos pelo Tutor;',
            'V. Informações financeiras e dados bancários necessários estritamente ao processamento de pagamentos.',
          ],
        },
        {
          text: '2.3. O tratamento dos dados descritos no item anterior possui como finalidades específicas:',
          sub: [
            'I. A viabilização e a prestação técnica dos serviços médico-veterinários e administrativos contratados;',
            'II. O estabelecimento de canais de contato e comunicação direta com o Tutor;',
            'III. A evolução e emissão de documentos eletrônicos, registros clínicos internos e prontuários;',
            'IV. A garantia da segurança da informação e a prevenção a fraudes no ambiente digital;',
            'V. O estrito cumprimento de obrigações legais, regulatórias e fiscais;',
            'VI. O aprimoramento contínuo das funcionalidades da plataforma e da experiência do usuário.',
          ],
        },
        { text: '2.4. Os dados coletados serão armazenados em ambiente digital seguro, mediante emprego de sistemas de armazenamento em nuvem e infraestrutura do Google Workspace, cujo acesso é restrito unicamente a profissionais autorizados e vinculados a rígidos deveres contratuais e éticos de confidencialidade e sigilo profissional.' },
        { text: '2.5. A ConectaVidas implementará medidas técnicas, administrativas e organizacionais de segurança para a salvaguarda das informações contra acessos não autorizados, destruição acidental ou ilícita, perda, alteração, comunicação ou qualquer forma de tratamento inadequado.' },
        {
          text: '2.6. É expressamente vedada a comercialização, cessão ou divulgação indevida de dados pessoais a terceiros, excetuando-se as hipóteses de:',
          sub: [
            'I. Cumprimento de obrigação legal, regulatória ou ordem emanada de autoridade judicial competente;',
            'II. Necessidade operacional estritamente vinculada e indispensável à execução dos serviços objeto deste contrato;',
            'III. Autorização prévia, expressa e específica concedida pelo titular dos dados.',
          ],
        },
        {
          text: '2.7. Em estrito alinhamento com os direitos previstos na LGPD, assiste ao usuário a prerrogativa de postular, a qualquer tempo, mediante requisição formal:',
          sub: [
            'I. A retificação ou correção de dados incompletos, inexatos ou desatualizados;',
            'II. A exclusão definitiva de sua conta de usuário e dos dados associados;',
            'III. A revogação do consentimento previamente outorgado para o tratamento de dados;',
            'IV. O acesso integral às informações de sua titularidade armazenadas nos bancos de dados;',
            'V. A portabilidade ou exportação dos dados, quando regulamentada e aplicável.',
          ],
        },
        { text: '2.8. O Tutor declara ciência de que, mesmo após o encerramento definitivo de sua conta, determinadas informações pessoais e registros clínicos serão mantidos pela ConectaVidas pelo prazo legal ou regulamentar residual estritamente necessário para o cumprimento de obrigações de guarda de prontuários, defesa em âmbito judicial ou administrativo, auditorias e resguardo de direitos legítimos da plataforma.' },
        { text: '2.9. Para o exercício de quaisquer direitos afetos à privacidade ou esclarecimento de dúvidas sobre a proteção de dados, o usuário deverá contactar o Encarregado pelo Tratamento de Dados por meio do endereço eletrônico oficial: suporteconectavidas@gmail.com.' },
        {
          text: '2.10. Em contrapartida e em estrito alinhamento com as diretrizes de proteção de dados e direitos de imagem, o Tutor assume o compromisso de sigilo absoluto em relação aos atos de atendimento e conteúdos disponibilizados pela ConectaVidas, aplicando-se as seguintes vedações, obrigações e penalidades:',
          sub: [
            'I. Fica terminantemente proibida a gravação, seja por áudio, vídeo ou captura de tela (print screen), de qualquer teleconsulta ou interação com os profissionais da plataforma, sem a autorização prévia e expressa, por escrito, da ConectaVidas e do médico-veterinário assistente;',
            'II. Resta expressamente proibida a divulgação, publicação, veiculação ou compartilhamento, em quaisquer redes sociais, aplicativos de mensagens (como WhatsApp) ou mídias públicas e privadas, de trechos de atendimentos, orientações recebidas, imagens ou áudios dos profissionais parceiros;',
            'III. É vedado o uso comercial de qualquer material informativo, mídias, conteúdos educativos ou documentos emitidos pela plataforma, os quais são de propriedade intelectual exclusiva da ConectaVidas ou protegidos por direitos autorais;',
            'IV. O Tutor obriga-se a proteger a imagem, a voz e os dados profissionais dos médicos-veterinários que o atenderem, utilizando o ambiente da plataforma estritamente para a finalidade de assistência ao seu animal;',
            'V. A violação culposa ou dolosa de qualquer das obrigações de sigilo previstas neste item ensejará a imediata suspensão ou exclusão da conta do Tutor, além de sua responsabilização civil por perdas e danos, violação de direito de imagem e propriedade intelectual, sem prejuízo das sanções criminais cabíveis.',
          ],
        },
      ],
    },
    {
      title: 'CLÁUSULA TERCEIRA – DA POLÍTICA DE TELEMEDICINA VETERINÁRIA E DIRETRIZES REGULAMENTARES',
      items: [
        { text: '3.1. A prestação de serviços na modalidade remota pela ConectaVidas subordina-se de forma completa e obrigatória às normas expedidas pelo Conselho Federal de Medicina Veterinária (CFMV), em especial às condicionantes éticas e operacionais fixadas pela Resolução CFMV nº 1.465/2022.' },
        { text: '3.2. Em estrita observância ao art. 2º da Resolução CFMV nº 1.465/2022, define-se a Telemedicina Veterinária como o exercício da Medicina Veterinária mediado por Tecnologias de Informação e Comunicação (TICs) com o objetivo de assistência, observando-se rigidamente os padrões técnicos, éticos, de segurança e de sigilo profissional.' },
        {
          text: '3.3. O Tutor declara estar plenamente ciente das seguintes condicionantes técnicas da teleorientação:',
          sub: [
            'I. O ato não substitui, sob qualquer pretexto, o exame clínico presencial;',
            'II. A eficácia e a segurança da orientação dependem umbilicalmente da veracidade, precisão e integridade das informações e históricos reportados pelo Tutor;',
            'III. A modalidade ostenta limitações diagnósticas intrínsecas pela impossibilidade de palpação, auscultação e demais atos semióticos físicos;',
            'IV. O caso clínico poderá demandar, a critério do profissional, a realização de exames complementares ou o imediato direcionamento para avaliação física presencial.',
          ],
        },
        { text: '3.4. O Tutor reconhece que as manifestações, orientações e decisões técnico-clínicas exaradas de forma remota são limitadas pela ausência do exame físico presencial, assumindo os riscos inerentes a essa modalidade ao optar pela contratação.' },
        {
          text: '3.5. É prerrogativa autônoma e exclusiva do médico-veterinário prestador do serviço:',
          sub: [
            'I. Recusar, declinar ou interromper o atendimento na modalidade remota sempre que constatar a ausência de condições técnicas ou de segurança para a salvaguarda da saúde animal;',
            'II. Encerrar imediatamente a sessão virtual em caso de condutas ofensivas, abusivas, desrespeitosas ou inadequadas perpetradas pelo Tutor;',
            'III. Determinar e orientar, em caráter de urgência, a busca imediata por suporte médico-veterinário hospitalar presencial.',
          ],
        },
        {
          text: '3.6. A ConectaVidas e os médicos-veterinários parceiros não incorrerão em responsabilidade civil ou profissional por agravamentos, intercorrências ou óbito do animal resultantes de:',
          sub: [
            'I. Omissão, falsidade, incompletude ou erro nas informações e dados clínicos fornecidos pelo Tutor;',
            'II. Descumprimento, negligência ou execução parcial das orientações e condutas prescritas pelos profissionais;',
            'III. Morosidade, atraso ou inércia do Tutor na busca por atendimento médico-veterinário presencial;',
            'IV. Falhas técnicas de conectividade de internet, defeitos em dispositivos de hardware do usuário ou deficiências na transmissão de dados, imagens e sons que prejudiquem a avaliação remota.',
          ],
        },
      ],
    },
    {
      title: 'CLÁUSULA QUARTA – POLÍTICA DE CANCELAMENTO E REEMBOLSO',
      items: [
        { text: '4.1. O cancelamento de consultas virtuais previamente agendadas e reservadas na plataforma poderá ser realizado pelo Tutor, sem ônus, desde que formalizado com antecedência mínima de 2 (duas) horas do horário aprazado.' },
        { text: '4.2. Não assiste ao Tutor o direito ao reembolso, estorno ou restituição de valores relativos a consultas e teleorientações comprovadamente executadas e disponibilizadas.' },
        { text: '4.3. Pleitos de restituição financeira baseados em alegadas falhas técnicas sistêmicas e relevantes da plataforma serão submetidos à auditoria interna, demandando comprovação inequívoca do vício de serviço por parte do usuário para fins de análise de excepcionalidade de reembolso.' },
        { text: '4.4. O prazo administrativo para a análise, deliberação e resposta acerca de requerimentos de cunho financeiro é de até 7 (sete) dias úteis, contados a partir da data de protocolo do pedido nos canais oficiais.' },
        { text: '4.5. Em estrita observância ao disposto no artigo 49 da Lei nº 8.078/1990 (Código de Defesa do Consumidor), assiste ao Tutor o direito de exercer o seu direito de arrependimento, podendo desistir da contratação no prazo improrrogável de até 7 (sete) dias corridos, contados a partir da data de assinatura do plano ou do recebimento do primeiro produto/serviço, fazendo jus à restituição integral dos valores eventualmente pagos dentro deste período.' },
      ],
    },
    {
      title: 'CLÁUSULA QUINTA – POLÍTICA DE ASSINATURA E CLÁUSULA DE FIDELIDADE',
      items: [
        { text: '5.1. Os planos de assinatura recorrente disponibilizados pela ConectaVidas possuem prazo de vigência mínima e fidelidade compulsória de 12 (doze) meses, computados a partir da data de adesão do usuário e aceite deste termo.' },
        { text: '5.2. O Tutor manifesta sua ciência expressa e concordância incondicional com o período de permanência mínima estipulado, reconhecendo que a concessão das condições financeiras do plano vincula-se à referida manutenção temporal.' },
        {
          text: '5.3. Durante a vigência do período de fidelidade fixado no item 5.1, aplicar-se-ão as seguintes regras:',
          sub: [
            'I. Não será admitida a resilição unilateral imotivada por iniciativa do Tutor sem a incidência das penalidades contratuais cabíveis;',
            'II. Os lançamentos financeiros e cobranças das mensalidades permanecerão ativos e exigíveis na periodicidade avençada;',
            'III. Os benefícios, coberturas e limites de utilização guardarão estrita consonância com a modalidade de plano especificamente contratada.',
          ],
        },
        {
          text: '5.4. A ocorrência de inadimplemento das obrigações financeiras por parte do Tutor autorizará a ConectaVidas a adotar, cumulativamente ou alternativamente, as seguintes medidas:',
          sub: [
            'I. Suspensão temporária da prestação dos serviços e do acesso à plataforma;',
            'II. Bloqueio de funcionalidades e restrição de agendamentos;',
            'III. Resolução contratual por justo motivo e cancelamento da conta, após regular notificação para purga da mora, sem prejuízo da cobrança judicial dos valores em atraso e aplicação de encargos legais.',
          ],
        },
        { text: '5.5. Transcorrido integralmente o período mínimo de fidelidade de 12 (doze) meses, assistirá ao usuário o direito de postular o cancelamento da renovação automática do plano, devendo manifestar sua intenção de forma expressa através dos canais oficiais de suporte.' },
      ],
    },
    {
      title: 'CLÁUSULA SEXTA – DAS DIRETRIZES OPERACIONAIS DO ATENDIMENTO GERAL',
      items: [
        { text: '6.1. O serviço de teleorientação e atendimento veterinário oferecido pela ConectaVidas opera em regime de prontidão contínua, estando disponível 24 (vinte e quatro) horas por dia, 7 (sete) dias por semana, incluindo repousos semanais remunerados, finais de semana e feriados.' },
        { text: '6.2. O suporte administrativo, operacional e financeiro da plataforma funcionará em dias úteis, no intervalo compreendido entre as 10h00 e as 18h00.' },
        { text: '6.3. Os atendimentos individuais realizados na modalidade de teleorientação observarão o tempo de duração médio estimado de 30 (trinta) minutos por sessão.' },
        { text: '6.4. O tempo de espera para o início do atendimento virtual possui caráter flutuante, estando sujeito a variações decorrentes do volume de demanda pontual, disponibilidade de profissionais na escala técnica, instabilidades imprevistas na rede de telecomunicações ou complexidade inerente aos casos clínicos precedentes.' },
        { text: '6.5. A ConectaVidas não outorga garantia de atendimento instantâneo, imediato ou com caráter de resgate emergencial, reiterando a vedação legal e técnica de manejo de situações críticas por via remota.' },
      ],
    },
    {
      title: 'CLÁUSULA SÉTIMA – DA POLÍTICA DE EMERGÊNCIA E ENCAMINHAMENTO CRÍTICO',
      items: [
        { text: '7.1. O Tutor declara-se advertido e ciente de que a plataforma ConectaVidas não se destina e não possui capacidade técnica para o atendimento de urgências e emergências médico-veterinárias, inexistindo garantia de triagem imediata para quadros agudos de risco de vida.' },
        {
          text: '7.2. Diante da constatação de sinais clínicos indicativos de emergência grave, incluindo, mas não se limitando a:',
          sub: [
            'I. Insuficiência ou severa dificuldade respiratória (dispneia);',
            'II. Crises convulsivas contínuas ou episódios de síncope;',
            'III. Hemorragias intensas e profusas não estancadas;',
            'IV. Quadros inequívocos ou suspeitas de intoxicação, envenenamento ou ingestão de corpos estranhos;',
            'V. Traumatismos graves decorrentes de atropelamentos, quedas ou agressões;',
            'VI. Estado de inconsciência, prostração extrema ou coma;',
            'VII. Sinais cardiorrespiratórios severos ou suspeita de parada cardiorrespiratória;',
          ],
        },
        { text: 'O Tutor deverá abster-se de utilizar a via remota, competindo-lhe proceder ao imediato deslocamento do animal para o serviço presencial de pronto-atendimento, clínica ou hospital veterinário mais próximo.' },
      ],
    },
    {
      title: 'CLÁUSULA OITAVA – DOS DEVERES DOS MÉDICOS-VETERINÁRIOS PARCEIROS',
      items: [
        {
          text: '8.1. Os profissionais médicos-veterinários cadastrados e atuantes por intermédio da plataforma ConectaVidas declaram formalmente:',
          sub: [
            'I. Possuir inscrição regular, ativa e sem impedimentos perante o Conselho Regional de Medicina Veterinária (CRMV) de sua respectiva jurisdição;',
            'II. Pautar sua atuação em estrita observância ao Código de Ética Profissional do Médico-Veterinário e às resoluções emanadas do CFMV;',
            'III. Zelar pelo decoro, rigor técnico, autonomia científica e excelência profissional no exercício de suas atribuições.',
          ],
        },
        { text: '8.2. Cada médico-veterinário parceiro responderá de forma individual, exclusiva e autônoma, nos âmbitos técnico, ético e civil, pelas orientações, condutas e atos profissionais praticados durante as teleconsultas, observados os limites legais da telemedicina veterinária.' },
      ],
    },
    {
      title: 'CLÁUSULA NONA – DA POLÍTICA E MEIOS DE PAGAMENTO',
      items: [
        {
          text: '9.1. A contraprestação financeira pelos serviços e assinaturas oferecidos pela ConectaVidas dar-se-á pelos meios eletrônicos homologados na plataforma, compreendendo:',
          sub: [
            'I. Cartão de crédito (modalidade à vista ou parcelada);',
            'II. Sistema de Pagamentos Instantâneos (PIX);',
            'III. Carteiras digitais integradas;',
            'IV. Débito em conta ou cobrança recorrente automatizada.',
          ],
        },
        { text: '9.2. A inadimplência de qualquer parcela ou mensalidade ensejará a suspensão automática da prestação dos serviços e do acesso à plataforma pelo Tutor, persistindo a restrição até a efetiva e comprovada regularização do débito junto ao setor financeiro.' },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA – DOS CANAIS OFICIAIS DE CONTATO E DO ESCOPO DE SUPORTE',
      items: [
        {
          text: '10.1. Para fins de comunicações formais, notificações, suporte administrativo e atendimento ao usuário, são estabelecidos os seguintes canais oficiais:',
          sub: [
            'I. Correio eletrônico (e-mail): suporteconectavidas@gmail.com;',
            'II. Perfil eletrônico na rede social Instagram: @conectavetbr.',
          ],
        },
        {
          text: '10.2. O suporte e o atendimento prestados por meio da plataforma ConectaVidas, observada a disponibilidade operacional e a escala de seus profissionais e colaboradores, possuem escopo delimitado às seguintes funcionalidades e competências:',
          sub: [
            'I. Prestação de esclarecimentos básicos acerca do funcionamento, usabilidade e navegação do sistema;',
            'II. Intermediação e efetivação de agendamentos de teleconsultas e teleorientações;',
            'III. Análise e processamento de requerimentos de estorno e reembolso, mediante comprovação de justo motivo e preenchimento dos requisitos contratuais;',
            'IV. Suporte técnico para a resolução de erros operacionais, falhas de sistema, bugs e inconsistências financeiras;',
            'V. Processamento de alterações, atualizações e correções nos dados cadastrais dos usuários;',
            'VI. Formalização, processamento e gestão de novas assinaturas e planos;',
            'VII. Fornecimento de diretrizes, orientações e processamento de solicitações de cancelamento de assinaturas após o período de fidelidade;',
            'VIII. Intermediação, suporte e resolução de questões afetas a trocas, devoluções ou logísticas de produtos vinculados à marca MAFFY;',
            'IX. Comercialização e operacionalização do plano de assinatura denominado MAFFYBOX AVULSA;',
            'X. Comercialização avulsa de materiais informativos, mídias e conteúdos educativos direcionados a tutores de animais.',
          ],
        },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA PRIMEIRA – DAS LIMITAÇÕES DA TELEMEDICINA VETERINÁRIA',
      items: [
        { text: '11.1. Os atendimentos realizados na modalidade de telemedicina veterinária observarão estritamente as diretrizes e normas editadas pelo Conselho Federal de Medicina Veterinária (CFMV), em especial as disposições da Resolução CFMV nº 1.465/2022, respeitando-se rigorosamente os limites técnicos e operacionais inerentes ao atendimento remoto.' },
        { text: '11.2. O(A) CONTRATANTE (Tutor) declara plena ciência de que as condutas qualificadas como padrão-ouro na medicina veterinária podem demandar, de forma imprescindível, estrutura hospitalar presencial, equipamentos de suporte vital específicos, monitoramento clínico contínuo, exames complementares imediatos, internação ou intervenção física direta — recursos estes indisponíveis no ambiente físico em que o paciente se encontra no ato do atendimento remoto.' },
        { text: '11.3. Diante das limitações descritas no item anterior, o médico-veterinário responsável poderá, a seu exclusivo critério técnico, fornecer orientações transitórias de suporte inicial remoto, dotadas de caráter eminentemente provisório e emergencial, com o escopo exclusivo de mitigar riscos imediatos até que o animal seja devidamente encaminhado e recebido por serviço médico-veterinário presencial adequado.' },
        { text: '11.4. O Tutor declara-se ciente de que as referidas medidas provisórias de suporte não substituem o atendimento hospitalar presencial e tampouco consubstanciam garantia de estabilização clínica, recuperação ou sobrevivência do animal.' },
        {
          text: '11.5. A plataforma ConectaVidas, bem como os profissionais veterinários parceiros, restarão integralmente isentos de qualquer responsabilidade civil, criminal ou administrativa por agravamentos clínicos, complicações, sequelas, perdas e danos ou óbito do paciente decorrentes de:',
          sub: [
            'I. Limitações técnicas e científicas intrínsecas à modalidade de telemedicina veterinária;',
            'II. Ausência de recursos hospitalares, ambulatoriais ou de suporte no local do atendimento remoto;',
            'III. Impossibilidade de execução de protocolos clínicos padrão-ouro fora de ambiente ambulatorial ou hospitalar devidamente equipado;',
            'IV. Demora, desídia, negligência ou impossibilidade de encaminhamento e transporte do animal para atendimento presencial por parte do Tutor;',
            'V. Condições clínicas pré-existentes, comorbidades ou evolução natural da patologia acometida ao animal.',
          ],
        },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA SEGUNDA – DO CONSENTIMENTO INFORMADO',
      items: [
        {
          text: '12.1. Ao prosseguir com o cadastro, contratação ou efetiva utilização dos serviços disponibilizados pela plataforma ConectaVidas, o Tutor manifesta sua anuência expressa, livre e informada, declarando formalmente que:',
          sub: [
            'I. Procedeu à leitura integral, analítica e compreensiva do presente instrumento;',
            'II. Compreendeu em sua totalidade os limites técnicos, regulatórios e operacionais da telemedicina veterinária;',
            'III. Autoriza expressamente o tratamento de seus dados pessoais e dos dados do paciente animal, em estrita conformidade com as disposições da Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018);',
            'IV. Consente com o armazenamento seguro e o processamento de suas informações e prontuários em ambiente digital, incluindo a infraestrutura de nuvem do Google Workspace e servidores correlatos;',
            'V. Reitera a compreensão de que os atendimentos remotos possuem limitações técnicas intransponíveis fora do ambiente clínico;',
            'VI. Manifesta integral concordância com os termos financeiros, condições de pagamento, regras operacionais e obrigações jurídicas ora apresentadas.',
          ],
        },
        { text: '12.2. As partes conferem ao presente consentimento plena validade jurídica eletrônica, equiparando o aceite digital, clique em botão de anuência ou assinatura eletrônica à assinatura física para todos os fins de direito.' },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA TERCEIRA – DOS ATRASOS E DO NÃO COMPARECIMENTO',
      items: [
        { text: '13.1. Os atendimentos agendados por meio da plataforma ConectaVidas serão realizados em estrita consonância com a disponibilidade dos profissionais médicos-veterinários parceiros e conforme os horários previamente reservados e confirmados pelo Tutor no sistema.' },
        {
          text: '13.2. O Tutor declara ciência e tolerância de que variações e pequenos atrasos no horário aprazado poderão ocorrer em virtude de:',
          sub: [
            'I. Complexidade técnica ou extensão imprevista de atendimentos e consultas anteriores;',
            'II. Intercorrências e emergências clínicas de outros pacientes;',
            'III. Instabilidades técnicas, oscilações na rede de internet ou falhas de conectividade alheias ao controle da plataforma;',
            'IV. Flutuações na demanda operacional pontual da plataforma.',
          ],
        },
        { text: '13.3. A ConectaVidas envidará seus melhores esforços para assegurar a estrita pontualidade dos horários programados, não obstante, face à natureza dinâmica e imprevisível da atividade médico-veterinária, não outorga garantia de pontualidade absoluta.' },
        {
          text: '13.4. Na hipótese de atraso por parte do Tutor para o início da teleconsulta:',
          sub: [
            'I. O médico-veterinário assistente ficará autorizado a reduzir proporcionalmente o tempo de duração da consulta, a fim de não impactar os agendamentos subsequentes;',
            'II. A continuidade do atendimento restará sujeita à necessidade de reagendamento, mediante disponibilidade da grade horária da plataforma;',
            'III. Atrasos que excedam o limite de tolerância estipulado pela plataforma serão formalmente caracterizados como ausência imotivada (não comparecimento).',
          ],
        },
        {
          text: '13.5. O não comparecimento do Tutor ao atendimento no horário agendado, sem que haja comunicação prévia e cancelamento tempestivo nos termos da política da plataforma, ensejará:',
          sub: [
            'I. A perda integral do direito ao atendimento agendado;',
            'II. A retenção dos valores pagos a título de taxa de reserva de horário, inexistindo direito a reembolso, estorno ou compensação financeira;',
            'III. A obrigatoriedade de realização de novo agendamento, condicionado a novo pagamento e à disponibilidade da plataforma.',
          ],
        },
        {
          text: '13.6. Em casos de impossibilidade técnica devidamente comprovada, ausência fortuita ou atraso excessivo e injustificado por parte do profissional médico-veterinário parceiro, competirá à ConectaVidas adotar as seguintes medidas resolutivas, a critério da administração:',
          sub: [
            'I. Proceder ao reagendamento prioritário do atendimento para data e horário convenientes ao Tutor;',
            'II. Realizar a substituição imediata do profissional médico-veterinário parceiro, observada a equivalência técnica;',
            'III. Conceder crédito interno equivalente ao valor despendido ou adotar solução operacional análoga, mediante prévia análise administrativa.',
          ],
        },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA QUARTA – DAS LIMITAÇÕES TÉCNICAS DO ATENDIMENTO DOMICILIAR E REMOTO, DA COMPETÊNCIA PROFISSIONAL E DO ENCAMINHAMENTO PRESENCIAL',
      items: [
        { text: '14.1. Os atendimentos eletivos realizados no âmbito da plataforma ConectaVidas observarão de forma cogente os ditames regulamentares do CFMV, com especial atenção à Resolução CFMV nº 1.465/2022 (Telemedicina Veterinária) e à Resolução CFMV nº 1.690/2026 (Atendimento Médico-Veterinário Domiciliar).' },
        { text: '14.2. O Tutor declara expressa ciência de que tanto o atendimento remoto quanto o atendimento domiciliar ostentam limitações técnicas severas e intrínsecas, decorrentes da ausência de infraestrutura hospitalar completa, impossibilidade de monitoramento intensivo contínuo, inviabilidade de exames diagnósticos complementares de alta complexidade imediatos e ausência de blocos cirúrgicos ou suporte avançado de vida.' },
        {
          text: '14.3. Por força das prerrogativas legais e regulamentares da profissão, compete exclusivamente ao médico-veterinário assistente avaliar, sob sua estrita responsabilidade técnica e autonomia profissional:',
          sub: [
            'I. A viabilidade técnica da manutenção do atendimento por via remota ou domiciliar;',
            'II. Os limites de segurança da atuação fora do ambiente clínico para o caso concreto;',
            'III. A necessidade impositiva de interrupção do ato e imediato encaminhamento do paciente para estrutura presencial;',
            'IV. A constatação de impossibilidade de continuidade segura do atendimento fora do ambiente hospitalar adequado.',
          ],
        },
        {
          text: '14.4. O médico-veterinário determinará o encaminhamento imediato do paciente para clínica ou hospital veterinário de livre escolha do Tutor sempre que restar evidenciado:',
          sub: [
            'I. Situação de urgência, emergência ou iminente risco à vida ou à integridade do paciente;',
            'II. Necessidade de realização de exames complementares urgentes ou complexos;',
            'III. Necessidade de internação, isolamento ou observação clínica;',
            'IV. Necessidade de monitoramento intensivo ou terapia infusional contínua;',
            'V. Necessidade de procedimentos médicos, cirúrgicos ou anestésicos cuja execução seja legal ou tecnicamente vedada fora de ambiente ambulatorial/hospitalar;',
            'VI. Qualquer limitação técnica ou ambiental que obste a avaliação semiológica segura e fidedigna do animal.',
          ],
        },
        { text: '14.5. O Tutor reconhece e declara que as clínicas e os hospitais veterinários devidamente registrados constituem o padrão-ouro de atendimento médico-veterinário, nos termos da regulação vigente, por deterem a estrutura técnico-infraestrutural adequada para o manejo de intercorrências graves e fornecimento de suporte avançado à vida animal.' },
        {
          text: '14.6. Sob nenhuma hipótese a ConectaVidas ou os profissionais parceiros responderão por danos, agravamentos, sequelas ou óbito do animal que decorram diretamente de:',
          sub: [
            'I. Limitações inerentes e intransponíveis do atendimento em ambiente remoto ou domiciliar;',
            'II. Ausência de estrutura física hospitalar adequada no local escolhido para o atendimento;',
            'III. Impossibilidade técnica de adoção de condutas de padrão-ouro fora do ambiente clínico;',
            'IV. Recusa, atraso, omissão ou impossibilidade do Tutor em cumprir a determinação de encaminhamento presencial do animal;',
            'V. Limitações e vedações regulamentares impostas pelas resoluções do CFMV.',
          ],
        },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA QUINTA – DO CONSENTIMENTO INFORMADO E ACEITE PLENO',
      items: [
        { text: '15.1. O(A) CONTRATANTE declara, expressamente, ter lido atentamente, compreendido na íntegra e aceitado, sem qualquer ressalva ou oposição, todas as condições, obrigações, direitos e informações contidas no presente Contrato de Assinatura, bem como no Termo de Consentimento Livre e Esclarecido que o acompanha.' },
        { text: '15.2. O(A) CONTRATANTE confirma que lhe foi concedida a oportunidade de sanar todas as suas dúvidas relativas ao funcionamento dos serviços, riscos, benefícios, limitações e aspectos financeiros da assinatura, tendo recebido esclarecimentos claros, satisfatórios e em linguagem acessível.' },
        { text: '15.3. Ao selecionar a opção "Li e aceito os termos" e prosseguir com a contratação, o(a) CONTRATANTE manifesta sua vontade livre, consciente e informada, conferindo plena anuência a todas as diretrizes operacionais, clínicas e administrativas estabelecidas para a prestação dos serviços objeto deste contrato.' },
      ],
    },
    {
      title: 'CLÁUSULA DÉCIMA SEXTA – DA AUTORIZAÇÃO E DO USO DE IMAGEM E VOZ',
      items: [
        { text: '16.1. O(A) CONTRATANTE (Tutor), nos termos dos artigos 5º, inciso X, da Constituição Federal, e 20 da Lei nº 10.406/2002 (Código Civil), concede à ConectaVidas, de forma inteiramente gratuita, irrevogável, irretratável e por prazo indeterminado, autorização para o uso de sua imagem e voz, bem como da imagem do paciente animal sob sua tutela, capturadas em decorrência da utilização dos serviços da plataforma.' },
        {
          text: '16.2. A presente autorização abrange a fixação, reprodução, exibição e veiculação das referidas imagens e áudios em quaisquer mídias, meios de comunicação e suportes existentes ou que venham a ser criados, aplicando-se estritamente às seguintes finalidades e condições:',
          sub: [
            'I. Fins exclusivamente institucionais, publicitários, de marketing, divulgação dos serviços da plataforma e cases de sucesso nas redes sociais oficiais, sites informativos e canais de comunicação da ConectaVidas;',
            'II. Fins acadêmicos, científicos, didáticos e educativos, incluindo a produção e comercialização de conteúdos pedagógicos voltados a tutores ou profissionais da área, respeitado o decoro e a ética profissional;',
            'III. Utilização em materiais impressos, mídias digitais, transmissões ao vivo (lives), vídeos promocionais ou campanhas publicitárias veiculadas na internet.',
          ],
        },
        { text: '16.3. Em estrita observância à Lei Geral de Proteção de Dados Pessoais (LGPD), a ConectaVidas compromete-se a realizar o tratamento das imagens e vozes pautando-se pelos princípios da finalidade e da adequação, assegurando que o uso do material não violará a honra, a boa fama ou a respeitabilidade do Tutor e de seu animal.' },
        { text: '16.4. O Tutor declara plena ciência de que a presente concessão é realizada a título gratuito, renunciando expressamente a qualquer tipo de remuneração, indenização, participação pecuniária, direitos autorais ou compensação financeira, presente ou futura, pela utilização das imagens e vozes autorizadas nos termos desta cláusula.' },
        { text: '16.5. Caso o Tutor deseje revogar especificamente a autorização de uso de imagem para fins de publicidade e marketing, deverá formalizar requerimento escrito junto ao canal de contato oficial suporteconectavidas@gmail.com, hipótese em que a ConectaVidas procederá à interrupção de novas veiculações e à remoção dos conteúdos digitais passíveis de exclusão técnica no prazo administrativo de até 15 (quinze) dias úteis.' },
      ],
    },
  ],
  closing: 'Este documento possui validade jurídica digital integral e vincula as partes eletronicamente no momento da confirmação e do aceite na plataforma ConectaVidas.',
}

const activeDoc = ref<'humana' | 'vet'>('humana')
const activeDocData = computed(() => (activeDoc.value === 'vet' ? termosVet : termosHumana))

const agreed = ref(false)
const confirmed = ref(false)
const confirming = ref(false)
const showWarning = ref(false)

// Recupera confirmação anterior salva no localStorage
onMounted(() => {
  const saved = localStorage.getItem('conectavet_terms_confirmed')
  if (saved === 'true') {
    agreed.value = true
    confirmed.value = true
  }
})

async function handleConfirm() {
  if (!agreed.value) {
    showWarning.value = true
    return
  }

  confirming.value = true

  // Simula pequeno delay para feedback visual
  await new Promise(resolve => setTimeout(resolve, 600))

  confirmed.value = true
  confirming.value = false
  localStorage.setItem('conectavet_terms_confirmed', 'true')
}

// Esconde aviso quando o usuário marca o checkbox
watch(agreed, (val) => {
  if (val) showWarning.value = false
})
</script>

<style scoped>
.terms-clause-title {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}
.terms-item {
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--color-text-muted);
  text-align: justify;
  margin-bottom: 0.5rem;
}
.terms-sublist {
  list-style: none;
  margin: 0 0 0.75rem 0;
  padding-left: 1rem;
  border-left: 2px solid rgba(1, 68, 150, 0.15);
}
.terms-sublist li {
  font-size: 0.83rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  text-align: justify;
  margin-bottom: 0.4rem;
  padding-left: 0.5rem;
}
.terms-closing {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(1, 68, 150, 0.15);
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.6;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
