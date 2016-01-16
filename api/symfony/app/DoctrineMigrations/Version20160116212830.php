<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20160116212830 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE computation (id INT AUTO_INCREMENT NOT NULL, hashid VARCHAR(10) NOT NULL, scheme VARCHAR(255) NOT NULL, operation VARCHAR(1) NOT NULL, a_encrypted LONGTEXT NOT NULL, b_encrypted LONGTEXT NOT NULL, public_key LONGTEXT NOT NULL COMMENT \'(DC2Type:json_array)\', stages LONGTEXT NOT NULL COMMENT \'(DC2Type:json_array)\', timestamp DATETIME NOT NULL, ip_address VARCHAR(15) NOT NULL, INDEX idx_computation_hashid (hashid), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE computation');
    }
}
