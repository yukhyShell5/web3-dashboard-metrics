// plopfile.js
module.exports = function (plop) {
    plop.setGenerator('story', {
      description: 'Génère un fichier .stories.tsx pour un composant',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Nom du composant (ex: AlertItem)',
        },
        {
          type: 'input',
          name: 'path',
          message: 'Chemin vers le dossier du composant (ex: components/ui)',
          default: 'components/ui',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/{{path}}/{{name}}.stories.tsx',
          templateFile: 'plop-templates/story.tsx.hbs',
        },
      ],
    });
  };
  