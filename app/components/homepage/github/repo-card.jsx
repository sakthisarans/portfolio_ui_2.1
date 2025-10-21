// @flow strict
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

function RepoCard({ repo }) {
  return (
    <div 
    onClick={() => window.open(repo.url, "_blank")} 
    className="border border-[#1d293a] hover:border-[#464c6a] transition-all duration-500 bg-[#1b203e] rounded-lg relative group">
      
      {/* Image */}
      <div className="h-44 lg:h-52 w-auto cursor-pointer overflow-hidden rounded-t-lg">
        <Image
          src={repo.cover_image}
          height={1080}
          width={1920}
          alt={repo.title || 'Repository Image'}
          className='h-full w-full group-hover:scale-110 transition-all duration-300'
        />
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 flex flex-col">
        {/* Repository Title */}
        <Link target='_blank' href={repo.url || '#'}>
          <p className='my-2 lg:my-3 cursor-pointer text-lg text-white sm:text-xl font-medium hover:text-violet-500 break-words truncate'>
            {repo.title}
          </p>
        </Link>

        {/* Description from README.md (render markdown, show first few lines) */}
        {repo.description ? (
          <div className='text-sm lg:text-base text-[#d3d8e8] pb-3 lg:pb-6 break-words'>
            {/* Render first 3 lines of markdown */}
            <ReactMarkdown>
              {repo.description.split('\n').slice(0, 3).join('\n')}
            </ReactMarkdown>
          </div>
        ) : (
          <p className='text-sm lg:text-base text-[#d3d8e8] pb-3 lg:pb-6 break-words'>No description available.</p>
        )}
      </div>
    </div>
  );
};

export default RepoCard;
