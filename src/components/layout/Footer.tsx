const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ifacens-dark text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PedZap</h3>
            <p className="text-gray-300">
              Seu cardápio digital para as barracas da faculdade.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#stands" className="text-gray-300 hover:text-white transition-colors">
                  Barracas
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <p className="text-gray-300">
              PedZap<br />
              Sorocaba, SP<br />
              contato@pedzap.com.br
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} PedZap. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
